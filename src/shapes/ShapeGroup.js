import { Container } from "pixi.js";

export default class ShapeGroup extends Container {

    applyTransformTo(child) {
        child.position.set(
            this.x + child.x * this.scale.x,
            this.y + child.y * this.scale.y
        );
        child.scale.set(
            child.scale.x * this.scale.x,
            child.scale.y * this.scale.y
        );
    }
}