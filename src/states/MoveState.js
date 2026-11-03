import ToolState from "./ToolState.js";
import SelectionManager from "../managers/SelectionManager.js";

export default class MoveState extends ToolState {
    constructor() {
        super();
        this.last = null;
    }

    onPointerDown(pos) {
        if (!SelectionManager.hasSelection()) return;
        this.last = { x: pos.x, y: pos.y };
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
    }

    onPointerUp() {
        this.last = null;
    }
}