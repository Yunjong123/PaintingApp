import ShapeState from "./ShapeState.js";

export default class StarState extends ShapeState {
    drawShape(g, start, end, style) {
        const radius = Math.hypot(end.x - start.x, end.y - start.y);

        g.star(start.x, start.y, 5, radius)
            .fill(style.fill)
            .stroke({ width: style.strokeWidth, color: style.stroke });
    }
}