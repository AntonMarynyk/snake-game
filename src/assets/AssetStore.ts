import type { AssetLoader, AssetManifest } from './AssetLoader.js';
import type { ImageAsset } from './ImageAsset.js';

export class AssetStore {
    private constructor(private readonly images: ReadonlyMap<string, ImageAsset>) { }

    public static async load(loader: AssetLoader, manifest: AssetManifest): Promise<AssetStore> {
        const entries = Object.entries(manifest);
        const images = await Promise.all(entries.map(([id, url]) => loader.loadImage(id, url)));
        return new AssetStore(new Map(images.map((image) => [image.id, image])));
    }

    public image(id: string): ImageAsset {
        const image = this.images.get(id);
        if (image === undefined) {
            throw new Error(`Unknown image asset "${id}"`);
        }
        return image;
    }

    public dispose(): void {
        this.images.forEach((image) => image.bitmap.close());
    }
}
