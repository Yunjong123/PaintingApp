import Command from "./Command.js";
import ShapeGroup from "../shapes/ShapeGroup.js";

export default class GroupCommand extends Command {
    constructor(layer, shapes) {
        super();
        this.layer = layer;
        this.group = new ShapeGroup();
        this.entries = shapes
            .map((shape) => ({ shape, index: layer.getChildIndex(shape) }))
            .sort((a, b) => a.index - b.index);
    }

    execute() {
        const topIndex = this.entries[this.entries.length - 1].index;
        const insertAt = topIndex - (this.entries.length - 1);

        for (const { shape } of this.entries) {
            shape.removeFromParent();
            this.group.addChild(shape);
        }
        this.layer.addChildAt(this.group, insertAt);
    }

    undo() {
        this.group.removeFromParent();
        for (const { shape, index } of this.entries) {
            shape.removeFromParent();
            this.layer.addChildAt(shape, index);
        }
    }
}