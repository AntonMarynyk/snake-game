import { COLORS } from '../config.js';
import type { Renderer } from '../rendering/Renderer.js';

export type HudModel = {
    readonly score: number;
    readonly hint: string;
};

export class HudView {
    public constructor(private readonly renderer: Renderer) { }

    public draw(model: HudModel): void {
        const { width, height } = this.renderer.size;

        this.renderer.drawText('SNAKE', { x: 32, y: 28 }, {
            fill: COLORS.accent,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
        });

        this.renderer.drawText(`SCORE ${model.score}`, { x: width - 32, y: 28 }, {
            fill: COLORS.textPrimary,
            fontSize: 22,
            fontWeight: 700,
            align: 'right',
        });

        this.renderer.drawText(model.hint, { x: width / 2, y: height - 26 }, {
            fill: COLORS.textMuted,
            fontSize: 15,
            align: 'center',
        });
    }
}
