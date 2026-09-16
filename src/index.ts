import { COLORS, VIEWPORT } from './config.js';
import { Stage } from './app/Stage.js';
import { InputFactory } from './input/InputFactory.js';
import { KeyboardInputProvider } from './input/keyboard/KeyboardInputProvider.js';
import { RendererFactory } from './rendering/RendererFactory.js';
import { CanvasRendererProvider } from './rendering/canvas/CanvasRendererProvider.js';
import { tryCatch } from './utils/tryCatch.js';

function bootstrap(): void {
  const root = document.getElementById('app');
  if (root === null) throw new Error('Missing mount point #app');

  const renderers = new RendererFactory([new CanvasRendererProvider(window.devicePixelRatio)]);
  const inputs = new InputFactory([new KeyboardInputProvider()]);

  const [stage, error] = tryCatch(() => Stage.create(root, VIEWPORT, renderers, inputs))();
  if (error !== null) throw error;

  stage.renderer.beginFrame();
  stage.renderer.clear(COLORS.background);
  stage.renderer.endFrame();

  stage.input.onCommand((command) => console.log('[input]', command));
}

try {
  bootstrap();
} catch (err) {
  window.alert(`Failed to bootstrap: ${err}`);
}
