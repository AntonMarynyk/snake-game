import { AdOutcome, type AdResult, type AdService } from '../AdService.js';
import type { AdOverlay } from '../AdOverlay.js';
import { ScriptLoader } from '../ScriptLoader.js';
import type { Size } from '../../rendering/Renderer.js';
import { Autobind } from '../../utils/autobind.js';

export type ImaAdOptions = {
    readonly sdkUrl: string;
    readonly adTagUrl: string;
    readonly size: Size;
    readonly timeoutMs: number;
};

@Autobind
export class ImaAdService implements AdService {
    private readonly scripts = new ScriptLoader();
    private displayContainer: google.ima.AdDisplayContainer | null = null;
    private adsLoader: google.ima.AdsLoader | null = null;
    private adsManager: google.ima.AdsManager | null = null;
    private sdkReady: Promise<void> | null = null;
    private playing = false;

    public constructor(
        private readonly overlay: AdOverlay,
        private readonly options: ImaAdOptions,
    ) { }

    public prepare(): Promise<void> {
        this.sdkReady ??= this.scripts.load(this.options.sdkUrl);
        return this.sdkReady;
    }

    public async playPreRoll(): Promise<AdResult> {
        if (this.playing) {
            return { outcome: AdOutcome.Failed, error: 'An ad break is already running' };
        }
        this.playing = true;
        this.overlay.show();

        const openedInGesture = this.openContainer(window.google?.ima);

        try {
            await this.prepare();

            const ima = window.google?.ima;
            if (ima === undefined) {
                return { outcome: AdOutcome.Failed, error: 'IMA SDK unavailable' };
            }
            if (!openedInGesture) this.openContainer(ima);

            return await this.runBreak(ima);
        } catch (error) {
            return { outcome: AdOutcome.Failed, error: describeError(error) };
        } finally {
            this.teardown();
            this.overlay.hide();
            this.playing = false;
        }
    }

    public dispose(): void {
        this.teardown();
    }

    private openContainer(ima: typeof google.ima | undefined): boolean {
        if (ima === undefined) return false;

        this.displayContainer?.destroy();
        this.displayContainer = new ima.AdDisplayContainer(this.overlay.adContainer, this.overlay.video);
        this.displayContainer.initialize();
        return true;
    }

    private runBreak(ima: typeof google.ima): Promise<AdResult> {
        return new Promise<AdResult>((resolve) => {
            let settled = false;
            const settle = (outcome: AdOutcome, error?: string): void => {
                if (settled) return;
                settled = true;
                window.clearTimeout(timer);
                resolve(error === undefined ? { outcome } : { outcome, error });
            };

            const timer = window.setTimeout(
                () => settle(AdOutcome.Failed, 'Ad break timed out'),
                this.options.timeoutMs,
            );

            const container = this.displayContainer;
            if (container === null) {
                settle(AdOutcome.Failed, 'Ad display container missing');
                return;
            }

            const adsLoader = new ima.AdsLoader(container);
            this.adsLoader = adsLoader;

            adsLoader.addEventListener(
                ima.AdErrorEvent.Type.AD_ERROR,
                (event) => settle(AdOutcome.Failed, readAdError(event)),
                false,
            );
            adsLoader.addEventListener(
                ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                (event) => this.startAds(ima, event, settle),
                false,
            );

            adsLoader.requestAds(this.createRequest(ima));
        });
    }

    private createRequest(ima: typeof google.ima): google.ima.AdsRequest {
        const { size, adTagUrl } = this.options;
        const request = new ima.AdsRequest();

        request.adTagUrl = adTagUrl + Date.now().toString();
        request.linearAdSlotWidth = size.width;
        request.linearAdSlotHeight = size.height;
        request.nonLinearAdSlotWidth = size.width;
        request.nonLinearAdSlotHeight = size.height;
        request.setAdWillAutoPlay(true);
        request.setAdWillPlayMuted(false);
        return request;
    }

    private startAds(
        ima: typeof google.ima,
        event: google.ima.AdsManagerLoadedEvent,
        settle: (outcome: AdOutcome, error?: string) => void,
    ): void {
        const settings = new ima.AdsRenderingSettings();
        settings.restoreCustomPlaybackStateOnAdBreakComplete = false;

        const manager = event.getAdsManager(this.overlay.video, settings);
        this.adsManager = manager;

        manager.addEventListener(
            ima.AdErrorEvent.Type.AD_ERROR,
            (adError) => settle(AdOutcome.Failed, readAdError(adError)),
            false,
        );
        manager.addEventListener(ima.AdEvent.Type.SKIPPED, () => settle(AdOutcome.Skipped), false);
        manager.addEventListener(
            ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            () => settle(AdOutcome.Completed),
            false,
        );
        manager.addEventListener(
            ima.AdEvent.Type.ALL_ADS_COMPLETED,
            () => settle(AdOutcome.Completed),
            false,
        );

        try {
            manager.init(this.options.size.width, this.options.size.height, ima.ViewMode.NORMAL);
            manager.start();
        } catch (error) {
            settle(AdOutcome.Failed, describeError(error));
        }
    }

    private teardown(): void {
        this.adsManager?.destroy();
        this.adsManager = null;

        this.adsLoader?.contentComplete();
        this.adsLoader?.destroy();
        this.adsLoader = null;

        this.displayContainer?.destroy();
        this.displayContainer = null;
    }
}

function readAdError(event: google.ima.AdErrorEvent): string {
    try {
        return event.getError().getMessage();
    } catch {
        return 'Unknown IMA error';
    }
}

function describeError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
