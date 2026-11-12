import ToolState from "./ToolState.js";
import SelectionManager from "../managers/SelectionManager.js";
import CommandHistory from "../managers/CommandHistory.js";
import TransformCommand from "../commands/TransformCommand.js";

export default class MoveState extends ToolState {
    constructor() {
        super();
        this.last = null;
        this.before = null;
        this.moved = false;
    }

    onPointerDown(pos) {
        if (!SelectionManager.hasSelection()) return;
        this.last = { x: pos.x, y: pos.y };
        this.before = TransformCommand.capture(SelectionManager.getSelected());
        this.moved = false;
    }

    onPointerMove(pos) {
        if (!this.last) return;

        const dx = pos.x - this.last.x;
        const dy = pos.y - this.last.y;

        for (const shape of SelectionManager.getSelected()) {
            shape.x += dx;
            shape.y += dy;
        }

        SelectionManager.refresh();
        this.last = { x: pos.x, y: pos.y };
        this.moved = true;
    }

    onPointerUp() {
        if (this.last && this.moved) {
            const after = TransformCommand.capture(SelectionManager.getSelected());
            CommandHistory.record(new TransformCommand(this.before, after));
        }
        this.last = null;
        this.before = null;
    }
}