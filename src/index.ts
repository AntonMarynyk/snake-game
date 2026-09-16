import { ASSET_BASE_URL, BOARD, VIEWPORT } from './config.js';
import { Stage } from './app/Stage.js';
import { ImageBitmapAssetLoader } from './assets/ImageBitmapAssetLoader.js';
import { ImageGameAssetsProvider } from './assets/ImageGameAssetsProvider.js';
import { Board } from './game/Board.js';
import { InputFactory } from './input/InputFactory.js';
import { KeyboardInputProvider } from './input/keyboard/KeyboardInputProvider.js';
import { RendererFactory } from './rendering/RendererFactory.js';
import { CanvasRendererProvider } from './rendering/canvas/CanvasRendererProvider.js';
import { GameView } from './view/GameView.js';
import { GridLayout } from './view/GridLayout.js';
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

  const board = new Board(BOARD.columns, BOARD.rows);
  const layout = GridLayout.centered(board, BOARD.cellSize, VIEWPORT);
  const view = new GameView(stage.renderer, layout, assets);

  const center = board.center();
  view.render({
    snake: [center, { x: center.x - 1, y: center.y }, { x: center.x - 2, y: center.y }],
    food: { x: center.x + 5, y: center.y - 3 },
    score: 0,
    hint: 'ARROWS move    ENTER confirm    ESC / BACKSPACE cancel',
  });

  stage.input.onCommand((command) => console.log('[input]', command));
}

bootstrap().catch((err) => window.alert(`Failed to bootstrap: ${err}`));
