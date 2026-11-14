import { Graphics } from "pixi.js";
import { Event } from "../Event.js";

const HIGHLIGHT_PADDING = 4;
const HIGHLIGHT_COLOR = 0x3399ff;

class SelectionManager {
    #selected = [];

    constructor() {
        this.highlight = null;
        this.onSelectionChanged = new Event(); // Observer: 선택이 바뀌면 알림
    }

    init(overlayLayer) {
        this.highlight = new Graphics();
        overlayLayer.addChild(this.highlight);
    }


    getSelected() {
        return [...this.#selected];
    }

    hasSelection() {
        return this.#selected.length > 0;
    }

    select(shapes) {
        this.#selected = [...shapes];
        this.refresh();
        this.onSelectionChanged.invoke(this.getSelected());
    }

    clear() {
        this.select([]);
    }

    removeDetached(layer) {
        this.select(this.#selected.filter((shape) => shape.parent === layer));
    }

    refresh() {
        this.highlight.clear();
        for (const shape of this.#selected) {
            const b = shape.getBounds();
            this.highlight
                .rect(
                    b.x - HIGHLIGHT_PADDING,
                    b.y - HIGHLIGHT_PADDING,
                    b.width + HIGHLIGHT_PADDING * 2,
                    b.height + HIGHLIGHT_PADDING * 2
                )
                .stroke({ width: 1, color: HIGHLIGHT_COLOR });
        }
    }
}

export default new SelectionManager();