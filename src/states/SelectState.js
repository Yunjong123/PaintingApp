import { Graphics } from "pixi.js";
import ToolState from "./ToolState.js";
import SelectionManager from "../managers/SelectionManager.js";
import Utils from "../managers/Utils.js";

const CLICK_THRESHOLD = 3;
const BOX_COLOR = 0x3399ff;

export default class SelectState extends ToolState {
    constructor(drawingLayer, overlayLayer) {
        super();
        this.drawingLayer = drawingLayer;
        this.overlayLayer = overlayLayer;
        this.start = null;
        this.box = null;
    }

    onPointerDown(pos) {
        this.start = { x: pos.x, y: pos.y };
        this.box = new Graphics();
        this.overlayLayer.addChild(this.box);
    }

    onPointerMove(pos) {
        if (!this.box) return;
        const r = toRect(this.start, pos);
        this.box.clear()
            .rect(r.x, r.y, r.width, r.height)
            .fill({ color: BOX_COLOR, alpha: 0.15 })
            .stroke({ width: 1, color: BOX_COLOR });
    }

    onPointerUp(pos) {
        if (!this.box) return;
        const r = toRect(this.start, pos);
        const isClick = r.width < CLICK_THRESHOLD && r.height < CLICK_THRESHOLD;

        SelectionManager.select(isClick ? this.shapeAt(pos) : this.shapesIn(r));

        this.box.destroy();
        this.box = null;
        this.start = null;
    }

    shapeAt(pos) {
        const topFirst = [...this.drawingLayer.children].reverse();
        const hit = topFirst.find((shape) => {
            const b = shape.getBounds();
            return pos.x >= b.x && pos.x <= b.x + b.width &&
                   pos.y >= b.y && pos.y <= b.y + b.height;
        });
        return hit ? [hit] : [];
    }

    shapesIn(r) {
        const area = toCenterRect(r);
        return this.drawingLayer.children.filter((shape) =>
            Utils.checkAABB(area, toCenterRect(shape.getBounds()))
        );
    }
}

function toRect(a, b) {
    return {
        x: Math.min(a.x, b.x),
        y: Math.min(a.y, b.y),
        width: Math.abs(b.x - a.x),
        height: Math.abs(b.y - a.y),
    };
}

function toCenterRect(r) {
    return {
        x: r.x + r.width / 2,
        y: r.y + r.height / 2,
        width: r.width,
        height: r.height,
    };
}