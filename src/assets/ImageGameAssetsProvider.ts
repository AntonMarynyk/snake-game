import type { AssetLoader, AssetManifest } from './AssetLoader.js';
import { AssetStore } from './AssetStore.js';
import type { GameAssets, GameAssetsProvider } from './GameAssets.js';
import { Autobind } from '../utils/autobind.js';

export const GAME_ASSET_MANIFEST: AssetManifest = {
    snakeHead: 'snake-head.png',
    snakeBody: 'snake-body.png',
    food: 'food.png',
};

@Autobind
export class ImageGameAssetsProvider implements GameAssetsProvider {
    private store: AssetStore | null = null;

    public constructor(
        private readonly loader: AssetLoader,
        private readonly manifest: AssetManifest = GAME_ASSET_MANIFEST,
    ) { }

    public async load(): Promise<GameAssets> {
        const store = await AssetStore.load(this.loader, this.manifest);
        this.store = store;

        return {
            snakeHead: store.image('snakeHead'),
            snakeBody: store.image('snakeBody'),
            food: store.image('food'),
        };
    }

    public dispose(): void {
        this.store?.dispose();
        this.store = null;
    }
}
