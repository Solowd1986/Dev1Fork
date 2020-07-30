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

class User {
    tick() {
        console.log(12);
    }
}

let u = new User();
u["tick"]();
u.tick();






