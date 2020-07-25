"use strict";

import {Excel} from "./components/excel/Excel";
import {Header} from "./components/header/Header";
import {Toolbar} from "./components/toolbar/Toolbar";

const excel = new Excel({
    appSelector: "#app", options: {
        components: [Header, Toolbar]
    }
});


excel.render();


class Listen {
    constructor() {
        this.listeners = [];
        this.callback = () => {console.log(this)};
        this.arrayOfChangedCallbacks = [];
        this.node = document.querySelector(".node");

    }

    initListener() {
        this.listeners.forEach(listeneer => {
            this.callback = this.callback.bind(this);
            this.node.addEventListener(listeneer, this.callback );
        })
    }

    removeListener() {
        this.listeners.forEach(listeneer => {
            this.node.removeEventListener(listeneer, this.callback );
        })
    }
}













