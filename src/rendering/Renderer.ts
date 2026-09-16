import type { ImageAsset } from '../assets/ImageAsset.js';

export type Size = {
  readonly width: number;
  readonly height: number;
};

export type Point = {
  readonly x: number;
  readonly y: number;
};

export type Rect = Point & Size;

export type Color = string;

export type RectStyle = {
  readonly fill?: Color;
  readonly stroke?: Color;
  readonly lineWidth?: number;
  readonly radius?: number;
};

export type TextAlign = 'left' | 'center' | 'right';

export type TextStyle = {
  readonly fill: Color;
  readonly fontSize: number;
  readonly fontWeight?: number;
  readonly align?: TextAlign;
  readonly letterSpacing?: number;
};

export interface Renderer {
  readonly size: Size;

  beginFrame(): void;
  endFrame(): void;
  clear(color: Color): void;
  drawRect(rect: Rect, style: RectStyle): void;
  drawText(text: string, position: Point, style: TextStyle): void;
  drawImage(image: ImageAsset, target: Rect, source?: Rect): void;
  dispose(): void;
}

export type CreateRenderer = (parent: HTMLElement, size: Size) => Renderer;
