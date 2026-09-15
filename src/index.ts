import { COLORS, VIEWPORT } from './config.js';
import { CanvasSurface } from './rendering/CanvasSurface.js';
import { tryCatch } from './utils/tryCatch.js';

function bootstrap(): void {
  const root = document.getElementById('app');
  if (!root) throw new Error('Missing mount point #app');
  const [surface, error] = tryCatch(CanvasSurface.mount)(root, VIEWPORT, window.devicePixelRatio);
  if (error !== null) {
    // provide a fallback for browsers that don't support canvas
    throw new Error(`Failed to mount canvas surface: ${error}`);
  }
  surface.clear(COLORS.background);
}

try {
  bootstrap();
} catch (err) {
  window.alert(`Failed to bootstrap: ${err}`);
}
