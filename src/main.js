import { Application, Container } from "pixi.js";
import ToolsManager from "./managers/ToolsManager.js";
import SelectionManager from "./managers/SelectionManager.js";
import CommandHistory from "./managers/CommandHistory.js";
import ToolState from "./states/ToolState.js";
import RectangleState from "./states/RectangleState.js";
import EllipseState from "./states/EllipseState.js";
import LineState from "./states/LineState.js";
import StarState from "./states/StarState.js";
import PolygonState from "./states/PolygonState.js";
import SelectState from "./states/SelectState.js";
import MoveState from "./states/MoveState.js";
import ScaleState from "./states/ScaleState.js";
import DeleteCommand from "./commands/DeleteCommand.js";
import GroupCommand from "./commands/GroupCommand.js";
import UngroupCommand from "./commands/UngroupCommand.js";
import ShapeGroup from "./shapes/ShapeGroup.js";
import { POLYGONS } from "./shapes/polygons.js";

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

    ToolsManager.addToolGroup("Polygons",["fa-solid","fa-draw-polygon"],
        POLYGONS.map((polygon) =>
            ToolsManager.getTool(polygon.name, polygon.icon, () => {
                currentState = new PolygonState(drawingLayer, getStyle, polygon.points);
            })
        )
    );

    let fillColorPicker = ToolsManager.getColorPicker("Fill Color");
    let strokeColorPicker = ToolsManager.getColorPicker("Stroke Color");
    let strokeInput = document.getElementById("stroke");
    let noFillInput = document.getElementById("no-fill");

    ToolsManager.addTool(fillColorPicker);
    ToolsManager.addTool(strokeColorPicker);

    ToolsManager.addTool(ToolsManager.getTool("Select Tool",["fa-solid","fa-arrow-pointer"], () => {
        currentState = new SelectState(drawingLayer, overlayLayer);
    }));

    ToolsManager.addTool(ToolsManager.getTool("Move Tool",["fa-solid","fa-up-down-left-right"], () => {
        currentState = new MoveState();
    }));

    ToolsManager.addTool(ToolsManager.getTool("Scale Tool",["fa-solid","fa-up-right-and-down-left-from-center"], () => {
        currentState = new ScaleState();
    }));

    ToolsManager.addTool(ToolsManager.getTool("Delete Tool",["fa-solid","fa-trash-can"], () => {
        deleteSelected();
    }));

    ToolsManager.addTool(ToolsManager.getTool("Group Tool",["fa-solid","fa-object-group"], () => {
        const shapes = SelectionManager.getSelected();
        if (shapes.length < 2) return;

        const command = new GroupCommand(drawingLayer, shapes);
        CommandHistory.execute(command);
        SelectionManager.select([command.group]);
    }));

    ToolsManager.addTool(ToolsManager.getTool("Ungroup Tool",["fa-regular","fa-object-group"], () => {
        const groups = SelectionManager.getSelected().filter((shape) => shape instanceof ShapeGroup);
        if (groups.length === 0) return;

        const released = [];
        for (const group of groups) {
            released.push(...group.children);
            CommandHistory.execute(new UngroupCommand(drawingLayer, group));
        }
        SelectionManager.select(released);
    }));

    container.appendChild(app.canvas);

    const drawingLayer = new Container();
    const overlayLayer = new Container();
    app.stage.addChild(drawingLayer, overlayLayer);
    SelectionManager.init(overlayLayer);

    let currentState = new ToolState();

    const getStyle = () => ({
        fill: noFillInput.checked ? null : fillColorPicker.getDecimal(),
        stroke: strokeColorPicker.getDecimal(),
        strokeWidth: Number(strokeInput.value),
    });

    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;

    app.stage.on("pointerdown", (e) => currentState.onPointerDown(e.global));
    app.stage.on("pointermove", (e) => currentState.onPointerMove(e.global));
    app.stage.on("pointerup", (e) => currentState.onPointerUp(e.global));
    app.stage.on("pointerupoutside", (e) => currentState.onPointerUp(e.global));

    function deleteSelected() {
        if (!SelectionManager.hasSelection()) return;
        CommandHistory.execute(new DeleteCommand(drawingLayer, SelectionManager.getSelected()));
    }

    let undoBtn = document.getElementById("undo");
    let redoBtn = document.getElementById("redo");

    undoBtn.addEventListener("click", () => CommandHistory.undo());
    redoBtn.addEventListener("click", () => CommandHistory.redo());

    const onHistoryChanged = () => {
        SelectionManager.removeDetached(drawingLayer);
        undoBtn.disabled = !CommandHistory.canUndo();
        redoBtn.disabled = !CommandHistory.canRedo();
    };
    CommandHistory.onChanged.addListener(onHistoryChanged);
    onHistoryChanged();


    document.addEventListener("keydown", (e) => {
        if (e.target instanceof HTMLInputElement) return;
        const ctrl = e.ctrlKey || e.metaKey;
        const key = e.key.toLowerCase();

        if (ctrl && key === "z" && !e.shiftKey) {
            e.preventDefault();
            CommandHistory.undo();
        } else if (ctrl && (key === "y" || (key === "z" && e.shiftKey))) {
            e.preventDefault();
            CommandHistory.redo();
        } else if (e.key === "Delete" || e.key === "Backspace") {
            deleteSelected();
        }
    });
})();