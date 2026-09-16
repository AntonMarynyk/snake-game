import { Autobind } from '../../utils/autobind.js';
import type { Renderer, Size } from '../Renderer.js';
import { RendererKind, type RendererProvider } from '../RendererFactory.js';
import { CanvasRenderer } from './CanvasRenderer.js';

@Autobind
export class CanvasRendererProvider implements RendererProvider {
    public readonly kind = RendererKind.Canvas;

    public constructor(private readonly devicePixelRatio: number) { }

    public isSupported(): boolean {
        return (
            typeof document !== 'undefined' &&
            typeof document.createElement('canvas').getContext === 'function'
        );
    }

    public create(parent: HTMLElement, size: Size): Renderer {
        return CanvasRenderer.mount(parent, size, this.devicePixelRatio);
    }
}
