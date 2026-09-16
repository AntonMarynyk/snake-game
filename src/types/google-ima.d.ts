declare namespace google.ima {
  class AdDisplayContainer {
    constructor(container: HTMLElement, video?: HTMLVideoElement);
    initialize(): void;
    destroy(): void;
  }

  class AdsLoader {
    constructor(container: AdDisplayContainer);
    requestAds(request: AdsRequest): void;
    addEventListener(type: string, listener: (event: AdsManagerLoadedEvent & AdErrorEvent) => void, capture?: boolean): void;
    contentComplete(): void;
    destroy(): void;
  }

  class AdsRequest {
    adTagUrl: string;
    linearAdSlotWidth: number;
    linearAdSlotHeight: number;
    nonLinearAdSlotWidth: number;
    nonLinearAdSlotHeight: number;
    setAdWillAutoPlay(autoPlay: boolean): void;
    setAdWillPlayMuted(muted: boolean): void;
  }

  class AdsRenderingSettings {
    restoreCustomPlaybackStateOnAdBreakComplete: boolean;
    uiElements: string[];
  }

  interface AdsManager {
    init(width: number, height: number, viewMode: string): void;
    start(): void;
    resize(width: number, height: number, viewMode: string): void;
    destroy(): void;
    addEventListener(type: string, listener: (event: AdErrorEvent) => void, capture?: boolean): void;
  }

  interface AdsManagerLoadedEvent {
    getAdsManager(contentPlayback: HTMLVideoElement, settings?: AdsRenderingSettings): AdsManager;
  }

  interface AdError {
    getMessage(): string;
    getErrorCode(): number;
  }

  interface AdErrorEvent {
    getError(): AdError;
  }

  namespace AdEvent {
    enum Type {
      ALL_ADS_COMPLETED = 'allAdsCompleted',
      COMPLETE = 'complete',
      CONTENT_RESUME_REQUESTED = 'contentResumeRequested',
      SKIPPED = 'skip',
      STARTED = 'start',
      LOADED = 'loaded',
    }
  }

  namespace AdErrorEvent {
    enum Type {
      AD_ERROR = 'adError',
    }
  }

  namespace AdsManagerLoadedEvent {
    enum Type {
      ADS_MANAGER_LOADED = 'adsManagerLoaded',
    }
  }

  enum ViewMode {
    NORMAL = 'normal',
    FULLSCREEN = 'fullscreen',
  }

  function settings(): void;
}

interface Window {
  google?: { ima?: typeof google.ima };
}
