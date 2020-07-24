"use strict";

import {ExcelComponents} from "../../core/ExcelComponent";

export class Header extends ExcelComponents{
    static elementClassName = "app__header";
    toHTML() {
        return "<h1>Header</h1>";
    }
}