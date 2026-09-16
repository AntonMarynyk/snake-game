import type { ImageAsset } from './ImageAsset.js';

export type AssetManifest = Readonly<Record<string, string>>;

export interface AssetLoader {
    loadImage(id: string, url: string): Promise<ImageAsset>;
}

export class AssetLoadError extends Error {
    public constructor(
        public readonly id: string,
        public readonly url: string,
        public readonly reason: string,
    ) {
        super(`Failed to load asset "${id}" from ${url} — ${reason}`);
        this.name = 'AssetLoadError';
    }
}
