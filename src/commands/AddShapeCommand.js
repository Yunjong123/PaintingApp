import Command from "./Command.js";

export default class AddShapeCommand extends Command {
    constructor(layer, shape) {
        super();
        this.layer = layer;
        this.shape = shape;
    }

    execute() {
        this.layer.addChild(this.shape);
    }

    undo() {
        this.shape.removeFromParent();
    }
}