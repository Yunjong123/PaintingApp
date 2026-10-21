import { Graphics } from "pixi.js";
import ToolState from "./ToolState.js";

export default class ShapeState extends ToolState {
    constructor(app, getStyle) {
        super(app);
        this.getStyle = getStyle;
        this.start = null;
        this.graphics = null;
    }

    onPointerDown(pos) {
        this.start = { x: pos.x, y: pos.y };
        this.graphics = new Graphics();
        this.app.stage.addChild(this.graphics);
    }

    onPointerMove(pos) {
        if (!this.graphics) return;
        this.redraw(pos);
    }

    onPointerUp(pos) {
        if (!this.graphics) return;
        this.redraw(pos);
        this.graphics = null;
        this.start = null;
    }

    redraw(pos) {
        this.graphics.clear();
        this.drawShape(this.graphics, this.start, pos, this.getStyle());
    }

    drawShape(g, start, end, style) {}
}