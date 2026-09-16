import type { InputFactory } from '../input/InputFactory.js';
import type { InputSource } from '../input/InputSource.js';
import type { Renderer, Size } from '../rendering/Renderer.js';
import type { RendererFactory } from '../rendering/RendererFactory.js';

export class Stage {
    private constructor(
        public readonly renderer: Renderer,
        public readonly input: InputSource,
    ) { }

    public static create(
        host: HTMLElement,
        size: Size,
        renderers: RendererFactory,
        inputs: InputFactory,
    ): Stage {
        return new Stage(renderers.create(host, size), inputs.create(host));
    }

    public dispose(): void {
        this.input.dispose();
        this.renderer.dispose();
    }
}
