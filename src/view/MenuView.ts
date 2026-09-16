import { COLORS } from '../config.js';
import type { Renderer } from '../rendering/Renderer.js';

export type MenuModel = {
    readonly title: string;
    readonly subtitle: string | null;
    readonly options: readonly string[];
    readonly selectedIndex: number;
};

const PANEL = { width: 520, height: 300, radius: 14 } as const;

export class MenuView {
    public constructor(private readonly renderer: Renderer) { }

    public draw(model: MenuModel): void {
        const { width, height } = this.renderer.size;
        const x = Math.round((width - PANEL.width) / 2);
        const y = Math.round((height - PANEL.height) / 2);
        const centerX = Math.round(width / 2);

        this.renderer.drawRect({ x: 0, y: 0, width, height }, { fill: COLORS.overlayScrim });
        this.renderer.drawRect(
            { x, y, width: PANEL.width, height: PANEL.height },
            { fill: COLORS.panel, stroke: COLORS.boardBorder, lineWidth: 2, radius: PANEL.radius },
        );

        this.renderer.drawText(model.title, { x: centerX, y: y + 68 }, {
            fill: COLORS.textPrimary,
            fontSize: 30,
            fontWeight: 700,
            align: 'center',
            letterSpacing: 1,
        });

        if (model.subtitle !== null) {
            this.renderer.drawText(model.subtitle, { x: centerX, y: y + 108 }, {
                fill: COLORS.textMuted,
                fontSize: 18,
                align: 'center',
            });
        }

        model.options.forEach((option, index) => {
            const selected = index === model.selectedIndex;
            const optionY = y + 160 + index * 52;

            if (selected) {
                this.renderer.drawRect(
                    { x: x + 110, y: optionY - 20, width: PANEL.width - 220, height: 40 },
                    { stroke: COLORS.accent, lineWidth: 2, radius: 8 },
                );
            }

            this.renderer.drawText(option, { x: centerX, y: optionY }, {
                fill: selected ? COLORS.accent : COLORS.textMuted,
                fontSize: 22,
                fontWeight: selected ? 700 : 400,
                align: 'center',
            });
        });

        this.renderer.drawText('UP / DOWN select    ENTER confirm    ESC = No', { x: centerX, y: y + PANEL.height - 30 }, {
            fill: COLORS.textMuted,
            fontSize: 14,
            align: 'center',
        });
    }
}
