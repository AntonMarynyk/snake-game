export type Size = {
  readonly width: number;
  readonly height: number;
}

export class CanvasSurface {
  private constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly context: CanvasRenderingContext2D,
    public readonly size: Size,
  ) { }

  public static mount(parent: HTMLElement, size: Size, devicePixelRatio = 1): CanvasSurface {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Canvas 2D is not supported in this browser');
    }

    const surface = new CanvasSurface(canvas, context, size);
    surface.applyResolution(devicePixelRatio);
    parent.appendChild(canvas);
    return surface;
  }

  public get ctx(): CanvasRenderingContext2D {
    return this.context;
  }

  public get element(): HTMLCanvasElement {
    return this.canvas;
  }

  public clear(color: string): void {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.size.width, this.size.height);
  }

  private applyResolution(devicePixelRatio: number): void {
    const ratio = Math.max(1, devicePixelRatio);
    this.canvas.width = Math.round(this.size.width * ratio);
    this.canvas.height = Math.round(this.size.height * ratio);
    this.canvas.style.width = `${this.size.width}px`;
    this.canvas.style.height = `${this.size.height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
}
