import type { Point } from '../rendering/Renderer.js';
import { Direction, directionVector, isOpposite } from './Direction.js';

export class Snake {
    private body: Point[];
    private heading: Direction;
    private committedHeading: Direction;

    public constructor(cells: readonly Point[], direction: Direction) {
        if (cells.length === 0) {
            throw new RangeError('Snake must have at least one segment');
        }
        this.body = [...cells];
        this.heading = direction;
        this.committedHeading = direction;
    }

    public static spawn(head: Point, length: number, direction: Direction): Snake {
        const step = directionVector(direction);
        const cells = Array.from({ length }, (_, index) => ({
            x: head.x - step.x * index,
            y: head.y - step.y * index,
        }));
        return new Snake(cells, direction);
    }

    public get head(): Point {
        return this.body[0] as Point;
    }

    public get length(): number {
        return this.body.length;
    }

    public get direction(): Direction {
        return this.heading;
    }

    public get segments(): readonly Point[] {
        return this.body;
    }

    public steer(direction: Direction): boolean {
        if (this.body.length > 1 && isOpposite(this.committedHeading, direction)) {
            return false;
        }
        this.heading = direction;
        return true;
    }

    public nextHead(): Point {
        const step = directionVector(this.heading);
        return { x: this.head.x + step.x, y: this.head.y + step.y };
    }

    public advance(grow: boolean): void {
        this.body.unshift(this.nextHead());
        if (!grow) {
            this.body.pop();
        }
        this.committedHeading = this.heading;
    }

    public occupies(cell: Point, ignoreTail = false): boolean {
        const end = ignoreTail ? this.body.length - 1 : this.body.length;
        return this.body.slice(0, end).some((segment) => segment.x === cell.x && segment.y === cell.y);
    }
}
