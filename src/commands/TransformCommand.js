import Command from "./Command.js";

export default class TransformCommand extends Command {
    constructor(before, after) {
        super();
        this.before = before;
        this.after = after;
    }

    static capture(shapes) {
        return shapes.map((shape) => ({
            shape,
            x: shape.x,
            y: shape.y,
            scaleX: shape.scale.x,
            scaleY: shape.scale.y,
        }));
    }

    static apply(snapshots) {
        for (const s of snapshots) {
            s.shape.position.set(s.x, s.y);
            s.shape.scale.set(s.scaleX, s.scaleY);
        }
    }

    execute() {
        TransformCommand.apply(this.after);
    }

    undo() {
        TransformCommand.apply(this.before);
    }
}