"use strict";

import {ExcelComponents} from "../../core/ExcelComponent";
import {createHeader} from "./template/header.template";

export class Header extends ExcelComponents{
    static name = "Header";
    constructor(root) {
        super(root, {
            name: Header.name,
            listeners: ["click"]
        });
    }
    static elementClassName = "app__header";

    toHTML() {
        return createHeader();
    }
    onClick(evt) {
        console.log(evt);
        console.log(this);
        console.log("click");
    }
    onInput() {
        console.log("input");
    }
}