import ShapeState from "./ShapeState.js";
export default class LineState extends ShapeState {
    get canFill() {
        return false;
    }

    get minStrokeWidth() {
        return 1;
    }

    drawShape(g, start, end) {
        g.moveTo(start.x, start.y).lineTo(end.x, end.y);
    }
}