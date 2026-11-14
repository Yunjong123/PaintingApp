import ShapeState from "./ShapeState.js";

export default class PolygonState extends ShapeState {
    constructor(layer, getStyle, points) {
        super(layer, getStyle);
        this.points = points;
    }

    drawShape(g, start, end) {
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const w = Math.abs(end.x - start.x);
        const h = Math.abs(end.y - start.y);

        const scaled = this.points.map((value, i) =>
            i % 2 === 0 ? x + value * w : y + value * h
        );
        g.poly(scaled);
    }
}