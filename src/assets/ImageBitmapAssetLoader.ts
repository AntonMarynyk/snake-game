import { AssetLoadError, type AssetLoader } from './AssetLoader.js';
import type { ImageAsset } from './ImageAsset.js';
import { Autobind } from '../utils/autobind.js';
import { tryCatch } from '../utils/tryCatch.js';

@Autobind
export class ImageBitmapAssetLoader implements AssetLoader {
    public constructor(private readonly baseUrl: string = '') { }

    public async loadImage(id: string, url: string): Promise<ImageAsset> {
        const resolved = this.baseUrl + url;

        const [response, requestError] = await tryCatch(fetch)(resolved);
        if (requestError !== null) {
            throw new AssetLoadError(id, resolved, requestError.message);
        }
        if (!response.ok) {
            throw new AssetLoadError(id, resolved, `HTTP ${response.status}`);
        }

        const [bitmap, decodeError] = await tryCatch(() => response.blob().then(createImageBitmap))();
        if (decodeError !== null) {
            throw new AssetLoadError(id, resolved, decodeError.message);
        }

        return { id, url: resolved, bitmap, width: bitmap.width, height: bitmap.height };
    }
}
