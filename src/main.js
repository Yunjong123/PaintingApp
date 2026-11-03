import { Application, Container } from "pixi.js";
import ToolsManager from "./managers/ToolsManager.js";
import SelectionManager from "./managers/SelectionManager.js";
import RectangleState from "./states/RectangleState.js";
import EllipseState from "./states/EllipseState.js";
import LineState from "./states/LineState.js";
import StarState from "./states/StarState.js";
import SelectState from "./states/SelectState.js";
import ToolState from "./states/ToolState.js";
import MoveState from "./states/MoveState.js";

import "../style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

(async () => {
    const app = new Application();

    const container = document.getElementById("pixi-container");

    await app.init({
        background: "#aaaaaa",
        resizeTo: container
    });

    ToolsManager.addToolGroup("Shapes",["fa-solid","fa-shapes"], [
        ToolsManager.getTool("Ellipse",["fa-regular","fa-circle"], () => {
            currentState = new EllipseState(drawingLayer, getStyle);
        }),
        ToolsManager.getTool("Rectangle",["fa-regular","fa-square"], () => {
            currentState = new RectangleState(drawingLayer, getStyle);
        }),
        ToolsManager.getTool("Line",["fa-solid","fa-lines-leaning"], () => {
            currentState = new LineState(drawingLayer, getStyle);
        }),
        ToolsManager.getTool("Star",["fa-regular","fa-star"], () => {
            currentState = new StarState(drawingLayer, getStyle);
        })
    ]);

    let fillColorPicker = ToolsManager.getColorPicker("Fill Color");
    let strokeColorPicker = ToolsManager.getColorPicker("Stroke Color");
    let strokeInput = document.getElementById("stroke");

    ToolsManager.addTool(fillColorPicker);
    ToolsManager.addTool(strokeColorPicker);

    ToolsManager.addTool(ToolsManager.getTool("Select Tool",["fa-solid","fa-arrow-pointer"], () => {
        currentState = new SelectState(drawingLayer, overlayLayer);
    }));

    ToolsManager.addTool(ToolsManager.getTool("Move Tool",["fa-solid","fa-up-down-left-right"], () => {
        currentState = new MoveState();
    }));

    ToolsManager.addTool(ToolsManager.getTool("Scale Tool",["fa-solid","fa-up-right-and-down-left-from-center"], () => {

    }));

    ToolsManager.addTool(ToolsManager.getTool("Delete Tool",["fa-solid","fa-trash-can"], () => {
        for (const shape of SelectionManager.getSelected()) {
            shape.removeFromParent();
        }
        SelectionManager.clear();
    }));

    ToolsManager.addTool(ToolsManager.getTool("Group Tool",["fa-solid","fa-object-group"], () => {

    }));

    ToolsManager.addTool(ToolsManager.getTool("Ungroup Tool",["fa-regular","fa-object-group"], () => {

    }));

    container.appendChild(app.canvas);

    const drawingLayer = new Container();
    const overlayLayer = new Container();
    app.stage.addChild(drawingLayer, overlayLayer);
    SelectionManager.init(overlayLayer);


    let currentState = new ToolState();

    const getStyle = () => ({
        fill: fillColorPicker.getDecimal(),
        stroke: strokeColorPicker.getDecimal(),
        strokeWidth: Number(strokeInput.value),
    });

    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;

    app.stage.on("pointerdown", (e) => currentState.onPointerDown(e.global));
    app.stage.on("pointermove", (e) => currentState.onPointerMove(e.global));
    app.stage.on("pointerup", (e) => currentState.onPointerUp(e.global));
    app.stage.on("pointerupoutside", (e) => currentState.onPointerUp(e.global));

    let undoBtn = document.getElementById("undo");
    let redoBtn = document.getElementById("redo");

    undoBtn.addEventListener("click",() => {

    });

    redoBtn.addEventListener("click",() => {

    });
})();