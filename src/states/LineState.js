import ShapeState from "./ShapeState.js";

export default class LineState extends ShapeState {
    drawShape(g, start, end, style) {
        g.moveTo(start.x, start.y)
            .lineTo(end.x, end.y)
            .stroke({ width: Math.max(1, style.strokeWidth), color: style.stroke });
    }
}