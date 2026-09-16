import type { Board } from '../game/Board.js';
import type { Point, Rect, Size } from '../rendering/Renderer.js';

export class GridLayout {
    public constructor(
        public readonly board: Board,
        public readonly cellSize: number,
        public readonly origin: Point,
    ) { }

    public static centered(board: Board, cellSize: number, viewport: Size): GridLayout {
        return new GridLayout(board, cellSize, {
            x: Math.round((viewport.width - board.columns * cellSize) / 2),
            y: Math.round((viewport.height - board.rows * cellSize) / 2),
        });
    }

    public static fit(board: Board, viewport: Size, padding: Point): GridLayout {
        const cellSize = Math.floor(
            Math.min(
                (viewport.width - padding.x * 2) / board.columns,
                (viewport.height - padding.y * 2) / board.rows,
            ),
        );
        return GridLayout.centered(board, cellSize, viewport);
    }

    public get width(): number {
        return this.board.columns * this.cellSize;
    }

    public get height(): number {
        return this.board.rows * this.cellSize;
    }

    public get bounds(): Rect {
        return { x: this.origin.x, y: this.origin.y, width: this.width, height: this.height };
    }

    public cellRect(cell: Point, inset = 0): Rect {
        return {
            x: this.origin.x + cell.x * this.cellSize + inset,
            y: this.origin.y + cell.y * this.cellSize + inset,
            width: this.cellSize - inset * 2,
            height: this.cellSize - inset * 2,
        };
    }
}
