import type {
  Color,
  Point,
  Rect,
  RectStyle,
  Renderer,
  Size,
  TextStyle,
} from '../Renderer.js';

const FONT_FAMILY = '"Courier New", "DejaVu Sans Mono", monospace';

export class CanvasRenderer implements Renderer {
  private constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly context: CanvasRenderingContext2D,
    public readonly size: Size,
  ) { }

  public static mount(parent: HTMLElement, size: Size, devicePixelRatio = 1): CanvasRenderer {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Canvas 2D is not supported in this browser');
    }

    const renderer = new CanvasRenderer(canvas, context, size);
    renderer.applyResolution(devicePixelRatio);
    parent.appendChild(canvas);
    return renderer;
  }

  public beginFrame(): void {
    this.context.save();
  }

  public endFrame(): void {
    this.context.restore();
  }

  public clear(color: Color): void {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.size.width, this.size.height);
  }

  public drawRect(rect: Rect, style: RectStyle): void {
    const radius = Math.min(style.radius ?? 0, rect.width / 2, rect.height / 2);

    this.context.beginPath();
    if (radius > 0) {
      this.context.roundRect(rect.x, rect.y, rect.width, rect.height, radius);
    } else {
      this.context.rect(rect.x, rect.y, rect.width, rect.height);
    }

    if (style.fill) {
      this.context.fillStyle = style.fill;
      this.context.fill();
    }
    if (style.stroke) {
      this.context.lineWidth = style.lineWidth ?? 1;
      this.context.strokeStyle = style.stroke;
      this.context.stroke();
    }
  }

  public drawText(text: string, position: Point, style: TextStyle): void {
    this.applyTextStyle(style);
    this.context.fillStyle = style.fill;
    this.context.fillText(text, position.x, position.y);
  }

  public dispose(): void {
    this.canvas.remove();
  }

  private applyTextStyle(style: TextStyle): void {
    this.context.font = `${style.fontWeight ?? 400} ${style.fontSize}px ${FONT_FAMILY}`;
    this.context.textAlign = style.align ?? 'left';
    this.context.textBaseline = 'middle';
    this.context.letterSpacing = `${style.letterSpacing ?? 0}px`;
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
