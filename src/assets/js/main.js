
import "normalize.css";
import "../scss/main.scss";
import "@babel/polyfill";

require.context('../img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);


import {cnt} from "./data";
import info from "./data";
console.log(cnt);
console.log(info.name);

const bd = () => {
    console.log(this);
};

class Base {
    constructor() {
        this.data = 12;
    }
    show() {
        console.log(this.data);
    }
    list(elem) {
        let foo = this.show.bind(this);
        elem.addEventListener("click", function (evt) {
            console.log(this);
            bd();
        });
    }
}

const d = new Base();
d.list(document.querySelector("div"));


const score = {
    name: "Bob",
    age: 21
};

let str = "<h1>{{name}}</h1><p>{{age}}</p>";
let res = str.replace(/{{(.*?)}}/g, (match, data) => {
    console.log(match);
    console.log(data);
    return score[data];
});

console.log("res - ", res);













