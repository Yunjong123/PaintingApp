import { Event } from "../Event.js";

class CommandHistory {
    #undoStack = [];
    #redoStack = [];

    constructor() {
        this.onChanged = new Event();
    }

    execute(command) {
        command.execute();
        this.record(command);
    }

    record(command) {
        this.#undoStack.push(command);
        this.#redoStack = [];
        this.onChanged.invoke();
    }

    undo() {
        const command = this.#undoStack.pop();
        if (!command) return;
        command.undo();
        this.#redoStack.push(command);
        this.onChanged.invoke();
    }

    redo() {
        const command = this.#redoStack.pop();
        if (!command) return;
        command.execute();
        this.#undoStack.push(command);
        this.onChanged.invoke();
    }

    canUndo() {
        return this.#undoStack.length > 0;
    }

    canRedo() {
        return this.#redoStack.length > 0;
    }
}

export default new CommandHistory();