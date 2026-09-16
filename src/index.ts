import { COLORS, VIEWPORT } from './config.js';
import { CanvasRendererProvider } from './rendering/canvas/CanvasRendererProvider.js';
import { RendererFactory } from './rendering/RendererFactory.js';
import { tryCatch } from './utils/tryCatch.js';

function bootstrap(): void {
  const root = document.getElementById('app');
  if (root === null) throw new Error('Missing mount point #app');

  const renderers = new RendererFactory([new CanvasRendererProvider(window.devicePixelRatio)]);

  const [renderer, error] = tryCatch(() => renderers.create(root, VIEWPORT))();
  if (error !== null) throw error;

  renderer.beginFrame();
  renderer.clear(COLORS.background);
  renderer.endFrame();
}

try {
  bootstrap();
} catch (err) {
  window.alert(`Failed to bootstrap: ${err}`);
}
