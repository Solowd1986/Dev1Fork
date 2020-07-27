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




new Promise((res, rej) => {
    setTimeout(() => {
        console.log("start");
        rej("error handle progress");
    }, 2000)
}).catch((error) => {
    console.log(error);
    return "error handled success";
}).then((msg) => {
    return new Promise((res) => {
        setTimeout(() => {
            console.log(msg);
            res();
        }, 2000);})
}).finally(() => {
    console.log("done");
});









