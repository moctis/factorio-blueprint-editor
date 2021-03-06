import * as PIXI from 'pixi.js'
import G from '~/common/globals'
import F from '~/UI/controls/functions'

export abstract class PaintContainer extends PIXI.Container {
    private readonly icon: PIXI.DisplayObject
    private _blocked = false

    protected constructor(name: string) {
        super()

        this.name = name

        this.on('added', this.applyTint.bind(this))

        this.icon = F.CreateIcon(this.getItemName())
        G.UI.addPaintIcon(this.icon)
        window.addEventListener('mousemove', this.updateIconPos)
        this.show()
    }

    protected get blocked(): boolean {
        return this._blocked
    }

    protected set blocked(value: boolean) {
        this._blocked = value
        this.applyTint()
    }

    private applyTint(): void {
        const t = {
            r: this.blocked ? 1 : 0.4,
            g: this.blocked ? 0.4 : 1,
            b: 0.4,
            a: 1
        }
        this.children.forEach((s: PIXI.Sprite) => F.applyTint(s, t))
    }

    public hide(): void {
        this.visible = false
        this.updateIconPos()
        this.icon.visible = true
    }

    public show(): void {
        this.visible = true
        this.icon.visible = false
    }

    public destroy(): void {
        this.emit('destroy')
        window.removeEventListener('mousemove', this.updateIconPos)
        this.icon.destroy()
        super.destroy()
    }

    // override
    public abstract getItemName(): string

    // override
    public abstract rotate(ccw?: boolean): void

    // override
    protected abstract redraw(): void

    // override
    public abstract moveAtCursor(): void

    // override
    public abstract removeContainerUnder(): void

    // override
    public abstract placeEntityContainer(): void

    protected getGridPosition(): IPoint {
        return {
            x: Math.round((this.x / 32) * 10) / 10,
            y: Math.round((this.y / 32) * 10) / 10
        }
    }

    protected setNewPosition(size: IPoint): void {
        if (size.x % 2 === 0) {
            const npx = G.BPC.gridData.x16 * 16
            this.x = npx + (npx % 32 === 0 ? 0 : 16)
        } else {
            this.x = G.BPC.gridData.x32 * 32 + 16
        }

        if (size.y % 2 === 0) {
            const npy = G.BPC.gridData.y16 * 16
            this.y = npy + (npy % 32 === 0 ? 0 : 16)
        } else {
            this.y = G.BPC.gridData.y32 * 32 + 16
        }
    }

    private readonly updateIconPos = (): void => {
        const position = G.app.renderer.plugins.interaction.mouse.global
        this.icon.position.set(position.x + 16, position.y + 16)
    }
}
