import Command from "./Command.js";

export default class DeleteCommand extends Command {
    constructor(layer, shapes) {
        super();
        this.layer = layer;
        this.entries = shapes
            .map((shape) => ({ shape, index: layer.getChildIndex(shape) }))
            .sort((a, b) => a.index - b.index);
    }

    execute() {
        for (const { shape } of this.entries) {
            shape.removeFromParent();
        }
    }

    undo() {
        for (const { shape, index } of this.entries) {
            this.layer.addChildAt(shape, index);
        }
    }
}