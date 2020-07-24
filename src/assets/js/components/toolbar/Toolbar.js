"use strict";

import {ExcelComponents} from "../../core/ExcelComponent";

export class Toolbar extends ExcelComponents {
    static elementClassName = "app__toolbar";
    toHTML() {
        return "<h1>Toolbar</h1>";
    }
}
