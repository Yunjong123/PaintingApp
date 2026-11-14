import Command from "./Command.js";
import TransformCommand from "./TransformCommand.js";

export default class UngroupCommand extends Command {
    constructor(layer, group) {
        super();
        this.layer = layer;
        this.group = group;
        this.children = [...group.children];
        this.index = -1;
        this.childTransforms = [];
    }

    execute() {
        this.index = this.layer.getChildIndex(this.group);
        this.childTransforms = TransformCommand.capture(this.children);
        this.group.removeFromParent();

        this.children.forEach((child, i) => {
            this.group.applyTransformTo(child);
            child.removeFromParent();
            this.layer.addChildAt(child, this.index + i);
        });
    }

    undo() {
        for (const child of this.children) {
            child.removeFromParent();
        }
        TransformCommand.apply(this.childTransforms);
        for (const child of this.children) {
            this.group.addChild(child);
        }
        this.layer.addChildAt(this.group, this.index);
    }
}