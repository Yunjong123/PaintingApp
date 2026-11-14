function regularPolygon(sides) {
    const raw = [];
    for (let i = 0; i < sides; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides; // 꼭짓점 하나가 위로
        raw.push(Math.cos(angle), Math.sin(angle));
    }
    return fitToUnitBox(raw);
}

function fitToUnitBox(points) {
    const xs = points.filter((_, i) => i % 2 === 0);
    const ys = points.filter((_, i) => i % 2 === 1);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);

    return points.map((value, i) =>
        i % 2 === 0
            ? (value - minX) / (maxX - minX)
            : (value - minY) / (maxY - minY)
    );
}

export const POLYGONS = [
    {
        name: "Triangle",
        icon: ["fa-solid", "fa-caret-up"],
        points: [0.5, 0, 1, 1, 0, 1],
    },
    {
        name: "Diamond",
        icon: ["fa-solid", "fa-diamond"],
        points: [0.5, 0, 1, 0.5, 0.5, 1, 0, 0.5],
    },
    {
        name: "Pentagon",
        icon: ["fa-solid", "fa-house"],
        points: regularPolygon(5),
    },
    {
        name: "Hexagon",
        icon: ["fa-solid", "fa-hexagon-nodes"],
        points: regularPolygon(6),
    },
    {
        name: "Arrow",
        icon: ["fa-solid", "fa-arrow-right"],
        points: [0, 0.3, 0.6, 0.3, 0.6, 0, 1, 0.5, 0.6, 1, 0.6, 0.7, 0, 0.7],
    },
];