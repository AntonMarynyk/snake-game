import type { Point } from '../rendering/Renderer.js';

export class Board {
    public constructor(
        public readonly columns: number,
        public readonly rows: number,
    ) {
        if (columns <= 0 || rows <= 0) {
            throw new RangeError('Board dimensions must be positive');
        }
    }

    public get cellCount(): number {
        return this.columns * this.rows;
    }

    public contains(cell: Point): boolean {
        return cell.x >= 0 && cell.y >= 0 && cell.x < this.columns && cell.y < this.rows;
    }

    public center(): Point {
        return { x: Math.floor(this.columns / 2), y: Math.floor(this.rows / 2) };
    }
}
