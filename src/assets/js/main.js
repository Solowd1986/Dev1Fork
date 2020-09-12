
import "normalize.css";
import "../scss/main.scss";
import "@babel/polyfill";

require.context('../img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);


import {cnt} from "./data";
import info from "./data";


const data = {
  phone: {
      cnt: 12,
      price: 1000
  }
};


class Component {
    constructor(props) {
        this.props = props;
    }

    render() {

    }
}

const props = {
    range: ".range-quantity"
};

function f2() {
    const range = document.querySelector(".range-quantity");
    const rangeParent = document.querySelector(".range-quantity").parentElement;
    let rangeElem = null;
    range.addEventListener("change", function (evt) {
        if (rangeElem !== null) {
            return;
        }
        rangeElem = document.createElement("input");
        rangeElem.type = "range";
        rangeElem.min = "1";
        rangeElem.max = "6";
        rangeParent.appendChild(rangeElem);
        console.log(this.value);
    });
}

f2();


const base = new Component(props);


function f3() {
    return document.createElement("div").classList.add("ss");
}


console.log(f3());


//document.querySelector("body").appendChild(f3());





async function f1() {
    await new Promise(resolve => {
        setTimeout(() => {
            console.log("st");
            resolve();
            }, 2000);
    });
    console.log("done");
    return "all stuff";
}

//f1().then(data => console.log(data));

























