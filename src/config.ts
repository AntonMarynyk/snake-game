import type { Size } from './rendering/Renderer.js';

export const VIEWPORT: Size = { width: 1280, height: 720 };

export const ASSET_BASE_URL = 'assets/';

export const COLORS = {
  background: '#0b0f14',
  boardBackground: '#111821',
  gridLine: '#18222e',
  boardBorder: '#26323f',
  textPrimary: '#e8eef5',
  textMuted: '#7c8b9c',
  accent: '#7ef0a0',
  panel: '#131b25',
  overlayScrim: 'rgba(11, 15, 20, 0.78)',
} as const;

export const EXIT_URL = 'https://www.google.com/search?q=snake+game';
