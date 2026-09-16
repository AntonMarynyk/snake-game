import { ASSET_BASE_URL, EXIT_URL, VIEWPORT } from './config.js';
import { NavigationExitService } from './app/ExitService.js';
import { Stage } from './app/Stage.js';
import { ImageBitmapAssetLoader } from './assets/ImageBitmapAssetLoader.js';
import { ImageGameAssetsProvider } from './assets/ImageGameAssetsProvider.js';
import { Game } from './game/Game.js';
import { ClassicRules } from './game/Rules.js';
import { InputFactory } from './input/InputFactory.js';
import { KeyboardInputProvider } from './input/keyboard/KeyboardInputProvider.js';
import { RendererFactory } from './rendering/RendererFactory.js';
import { CanvasRendererProvider } from './rendering/canvas/CanvasRendererProvider.js';
import { tryCatch } from './utils/tryCatch.js';

async function bootstrap(): Promise<void> {
  const root = document.getElementById('app');
  if (root === null) throw new Error('Missing mount point #app');

  const renderers = new RendererFactory([new CanvasRendererProvider(window.devicePixelRatio)]);
  const inputs = new InputFactory([new KeyboardInputProvider()]);

  const [stage, stageError] = tryCatch(Stage.create)(root, VIEWPORT, renderers, inputs);
  if (stageError !== null) throw stageError;

  const gameAssets = new ImageGameAssetsProvider(new ImageBitmapAssetLoader(ASSET_BASE_URL));
  const [assets, assetError] = await tryCatch(gameAssets.load)();
  if (assetError !== null) throw assetError;

  const game = new Game({
    renderer: stage.renderer,
    input: stage.input,
    assets,
    rules: new ClassicRules(),
    exit: new NavigationExitService(EXIT_URL),
  });

  game.start();
}

bootstrap().catch((err) => window.alert(`Failed to bootstrap: ${err}`));
