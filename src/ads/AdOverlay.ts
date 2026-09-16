import type { Size } from '../rendering/Renderer.js';

export class AdOverlay {
    public readonly root: HTMLDivElement;
    public readonly adContainer: HTMLDivElement;
    public readonly video: HTMLVideoElement;

    public constructor(parent: HTMLElement, private readonly size: Size) {
        this.root = document.createElement('div');
        this.applyOverlayLayout(this.root);

        this.video = document.createElement('video');
        this.video.playsInline = true;
        this.video.setAttribute('playsinline', '');
        this.applyFullSize(this.video);

        this.adContainer = document.createElement('div');
        this.applyFullSize(this.adContainer);

        this.root.appendChild(this.video);
        this.root.appendChild(this.adContainer);
        parent.appendChild(this.root);
        this.hide();
    }

    public show(): void {
        this.root.style.visibility = 'visible';
        this.root.style.pointerEvents = 'auto';
    }

    public hide(): void {
        this.root.style.visibility = 'hidden';
        this.root.style.pointerEvents = 'none';
    }

    public dispose(): void {
        this.root.remove();
    }

    private applyOverlayLayout(element: HTMLElement): void {
        this.applyFullSize(element);
        element.style.background = '#000';
        element.style.zIndex = '10';
    }

    private applyFullSize(element: HTMLElement): void {
        element.style.position = 'absolute';
        element.style.left = '0';
        element.style.top = '0';
        element.style.width = `${this.size.width}px`;
        element.style.height = `${this.size.height}px`;
        element.style.objectFit = 'contain';
    }
}
