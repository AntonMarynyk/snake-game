export type FrameListener = (timestampMs: number) => void;

export interface Ticker {
    start(onFrame: FrameListener): void;
    stop(): void;
}

export class AnimationFrameTicker implements Ticker {
    private handle: number | null = null;

    public start(onFrame: FrameListener): void {
        if (this.handle !== null) return;

        const step = (timestampMs: number): void => {
            this.handle = window.requestAnimationFrame(step);
            onFrame(timestampMs);
        };
        this.handle = window.requestAnimationFrame(step);
    }

    public stop(): void {
        if (this.handle === null) return;

        window.cancelAnimationFrame(this.handle);
        this.handle = null;
    }
}
