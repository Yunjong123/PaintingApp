import ShapeState from "./ShapeState.js";

export default class EllipseState extends ShapeState {
    drawShape(g, start, end, style) {
        const cx = (start.x + end.x) / 2;
        const cy = (start.y + end.y) / 2;
        const rx = Math.abs(end.x - start.x) / 2;
        const ry = Math.abs(end.y - start.y) / 2;

        g.ellipse(cx, cy, rx, ry)
            .fill(style.fill)
            .stroke({ width: style.strokeWidth, color: style.stroke });
    }
}