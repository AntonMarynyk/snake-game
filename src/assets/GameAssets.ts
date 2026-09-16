import type { ImageAsset } from './ImageAsset.js';

export interface GameAssets {
    readonly snakeHead: ImageAsset;
    readonly snakeBody: ImageAsset;
    readonly food: ImageAsset;
}

export interface GameAssetsProvider {
    load(): Promise<GameAssets>;
    dispose(): void;
}
