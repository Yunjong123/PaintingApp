import ShapeState from "./ShapeState.js";

export default class RectangleState extends ShapeState {
    drawShape(g, start, end, style) {
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const w = Math.abs(end.x - start.x);
        const h = Math.abs(end.y - start.y);

        g.rect(x, y, w, h)
            .fill(style.fill)
            .stroke({ width: style.strokeWidth, color: style.stroke });
    }
}