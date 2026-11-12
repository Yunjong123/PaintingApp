import { Graphics } from "pixi.js";
import ToolState from "./ToolState.js";
import CommandHistory from "../managers/CommandHistory.js";
import AddShapeCommand from "../commands/AddShapeCommand.js";

const MIN_DRAG_DISTANCE = 2;

export default class ShapeState extends ToolState {
    constructor(layer, getStyle) {
        super();
        this.layer = layer;
        this.getStyle = getStyle;
        this.start = null;
        this.graphics = null;
    }

    get canFill() {
        return true;
    }

    get minStrokeWidth() {
        return 0;
    }

    onPointerDown(pos) {
        this.start = { x: pos.x, y: pos.y };
        this.graphics = new Graphics();
        this.layer.addChild(this.graphics);
    }

    onPointerMove(pos) {
        if (!this.graphics) return;
        this.redraw(pos);
    }

    onPointerUp(pos) {
        if (!this.graphics) return;

        const dragged = Math.hypot(pos.x - this.start.x, pos.y - this.start.y);
        if (dragged < MIN_DRAG_DISTANCE) {
            this.graphics.destroy();
        } else {
            this.redraw(pos);
            CommandHistory.record(new AddShapeCommand(this.layer, this.graphics));
        }

        this.graphics = null;
        this.start = null;
    }

    redraw(pos) {
        const style = this.getStyle();
        const g = this.graphics;

        g.clear();
        this.drawShape(g, this.start, pos);

        if (this.canFill && style.fill !== null) {
            g.fill(style.fill);
        }
        const strokeWidth = Math.max(this.minStrokeWidth, style.strokeWidth);
        if (strokeWidth > 0) {
            g.stroke({ width: strokeWidth, color: style.stroke });
        }
    }
    drawShape(g, start, end) {}
}