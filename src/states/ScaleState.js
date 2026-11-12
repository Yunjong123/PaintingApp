import ToolState from "./ToolState.js";
import SelectionManager from "../managers/SelectionManager.js";
import CommandHistory from "../managers/CommandHistory.js";
import TransformCommand from "../commands/TransformCommand.js";

const MIN_SCALE = 0.05;
const MIN_START_DISTANCE = 5;

export default class ScaleState extends ToolState {
    constructor() {
        super();
        this.center = null;
        this.startDistance = 0;
        this.before = [];
    }

    onPointerDown(pos) {
        const shapes = SelectionManager.getSelected();
        if (shapes.length === 0) return;

        const center = getCenter(shapes);
        const startDistance = distance(center, pos);
        if (startDistance < MIN_START_DISTANCE) return;

        this.center = center;
        this.startDistance = startDistance;
        this.before = TransformCommand.capture(shapes);
    }

    onPointerMove(pos) {
        if (!this.center) return;

        const factor = Math.max(MIN_SCALE, distance(this.center, pos) / this.startDistance);

        for (const o of this.before) {
            o.shape.position.set(
                this.center.x + (o.x - this.center.x) * factor,
                this.center.y + (o.y - this.center.y) * factor
            );
            o.shape.scale.set(o.scaleX * factor, o.scaleY * factor);
        }

        SelectionManager.refresh();
    }

    onPointerUp() {
        if (this.center) {
            const shapes = this.before.map((o) => o.shape);
            CommandHistory.record(new TransformCommand(this.before, TransformCommand.capture(shapes)));
        }
        this.center = null;
        this.before = [];
    }
}

function getCenter(shapes) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const shape of shapes) {
        const b = shape.getBounds();
        minX = Math.min(minX, b.x);
        minY = Math.min(minY, b.y);
        maxX = Math.max(maxX, b.x + b.width);
        maxY = Math.max(maxY, b.y + b.height);
    }
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

function distance(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}