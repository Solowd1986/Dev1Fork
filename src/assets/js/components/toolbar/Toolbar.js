"use strict";

import {ExcelComponents} from "../../core/ExcelComponent";

export class Toolbar extends ExcelComponents {
    constructor(root) {
        super(root, {
            name: "Toolbar",
            listeners: []
        });
    }
    static elementClassName = "app__toolbar";
    toHTML() {
        return "<h1>Toolbar</h1>";
    }
    onClick() {
        console.log("click from ", this.constructor.name);

    }
    onInput() {
        console.log("input");
    }
}
