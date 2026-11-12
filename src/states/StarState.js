import ShapeState from "./ShapeState.js";

const STAR_POINTS = 5;

export default class StarState extends ShapeState {
    drawShape(g, start, end) {
        const radius = Math.hypot(end.x - start.x, end.y - start.y);

        g.star(start.x, start.y, STAR_POINTS, radius);
    }
}