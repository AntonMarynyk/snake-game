import type { Point } from '../rendering/Renderer.js';

export type PointerButton = 'primary' | 'secondary' | 'middle';

export type PointerListener = (button: PointerButton, position: Point) => void;

export interface PointerEventSource {
    onPointerDown(listener: PointerListener): () => void;
}
