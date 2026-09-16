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

export const ADS = {
  sdkUrl: 'https://imasdk.googleapis.com/js/sdkloader/ima3.js',
  adTagUrl:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples' +
    '&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1' +
    '&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
  timeoutMs: 20000,
} as const;

export const EXIT_URL = 'https://www.google.com/search?q=snake+game';
