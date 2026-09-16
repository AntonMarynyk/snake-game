import type { CreateRenderer, Renderer, Size } from './Renderer.js';
import { tryCatch } from '../utils/tryCatch.js';

export const enum RendererKind {
    Canvas = 'canvas',
    WebGL = 'webgl',
    DOM = 'dom',
}

export type RendererProvider = {
    readonly kind: RendererKind;
    isSupported(): boolean;
    readonly create: CreateRenderer;
};

export const DEFAULT_RENDERER_PRIORITY: readonly RendererKind[] = [RendererKind.Canvas, RendererKind.WebGL, RendererKind.DOM];

export class NoRendererAvailableError extends Error {
    public constructor(
        public readonly priority: readonly RendererKind[],
        public readonly attempts: readonly RendererAttempt[],
    ) {
        const detail = attempts.map((a) => `${a.kind}: ${a.reason}`).join('; ');
        super(
            `No rendering backend could be created (priority: ${priority.join(' > ')})` +
            (detail ? ` — ${detail}` : ''),
        );
        this.name = 'NoRendererAvailableError';
    }
}

export type RendererAttempt = {
    readonly kind: RendererKind;
    readonly reason: string;
};

export class RendererFactory {
    private readonly providers: ReadonlyMap<RendererKind, RendererProvider>;

    public constructor(
        providers: readonly RendererProvider[],
        private readonly priority: readonly RendererKind[] = DEFAULT_RENDERER_PRIORITY,
    ) {
        this.providers = new Map(providers.map((provider) => [provider.kind, provider]));
    }
    public create(parent: HTMLElement, size: Size): Renderer {
        const attempts: RendererAttempt[] = [];

        for (const kind of this.priority) {
            const provider = this.providers.get(kind);
            if (provider === undefined) {
                attempts.push({ kind, reason: 'no provider registered' });
                continue;
            }

            if (!provider.isSupported()) {
                attempts.push({ kind, reason: 'not supported in this browser' });
                continue;
            }

            const [renderer, error] = tryCatch(provider.create)(parent, size);
            if (error === null) {
                return renderer;
            }
            attempts.push({ kind, reason: error.message });
        }

        throw new NoRendererAvailableError(this.priority, attempts);
    }
}
