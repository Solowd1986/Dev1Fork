
import "normalize.css";
import "../assets/scss/main.scss";
import "@babel/polyfill";


require.context('../assets/img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);


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




const base = new Component(props);


const orderButtnos = document.querySelectorAll(".select-quantity");

const orderParent = document.querySelector(".list-goods");


function normilize (val) {
    let value = parseInt(val);
    let max = 10;
    let min = 1;
    if (isNaN(value) || value < min) {
        value = min;
    } else if (value > max) {
        value = max;
    }
    return value;
}

// orderParent.addEventListener("click", function (evt) {
//   if (evt.target.classList.contains("select-quantity")) {
//       for (let item of evt.target.parentElement.children) {
//           if (item.classList.contains("goods-quantity")) {
//               item.value = normilize(item.value);
//           }
//       }
//   }
// }, true);
//
//
// orderParent.addEventListener("click", function (evt) {
//     if (evt.target.classList.contains("delete-item")) {
//         evt.target.parentElement.parentElement.remove();
//     }
// }, true);


const classes = {
    list: "list-goods",
    item: "goods-item",
    itemDesc: "goods-desc",
    orderWrapper: "wrapper-order",
    inputQuantity: "goods-quantity",
    btnChangeQuantity: "btn-order-cart select-quantity",
    btnDeleteItem: "btn-order-cart delete-item",
};

const dataItems = [
    {quantity: 1, price: 2000, title: "Samsung S20"},
    {quantity: 3, price: 4350, title: "Apple XL"},
    {quantity: 4, price: 6200, title: "Nokia 3100"},
];

const dataAll = {
    dataItems: dataItems,
    classes: classes

};





class Request {
    static sendRequest(url, options = {method: "GET"}) {
        //console.log(url);
        
        return fetch(url, {
            method: options.method,
            //body: data,
            // headers: {
            //     Accept: 'application/json',
            // },
            //mode: 'no-cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        }).then(response => {
            if (!response.ok) {
                console.dir(response);
                
                return response.text().then(error => {
                    
                    console.log('errro', error);
                    
                    // throw new Error(`HTTP Request Error\nStatus: ${response.status}\nMessage: ${error.match(/<pre>(?<errorMsg>.*)<\/pre>/i) !== null 
                    //     ? error.match(/<pre>(?<errorMsg>.*)<\/pre>/i).groups.errorMsg
                    //     : response.statusText}`);
                });
            } else {
                //console.dir(response);
                //return response.text();
                return response.text();
            }
        });
    }

    async getAllData() {
        await Request.sendRequest("data.php", {method: "GET"}).
        then(res => {
            //console.log(res);

            let root = document.querySelector(".result");
            let h3 = document.createElement("h3");
            h3.innerText = "All data";
            h3.style.cssText = "text-align: center";
            root.append(h3);

            let ul = document.createElement("ul");
            let result = JSON.parse(res);

            result.forEach(item => {
                let li = document.createElement("li");
                li.style.cssText = "padding: 5px; outline: 1px solid red; margin-bottom: 5px;";
                for (let data in item) {
                    let div = document.createElement("div");
                    div.style.cssText = "padding: 2px;";
                    div.innerText = `${data}: ${item[data]}`;
                    li.append(div);
                }
                ul.append(li)
            });
            root.append(ul);

            //console.log('all data:', JSON.parse(res));
        }).
        catch(e => {
            console.log(e)
        });
    }

    async getOneItem(id) {
        await Request.sendRequest(`data.php?id=${id}`, {method: "GET"}).
        then(res => {
            //document.querySelector(".error").innerHTML = res;
            let result = JSON.parse(res);
            console.log('one item:', result[0]);
        }).
        catch(e => {
            console.log(e)
        });
    }

    async deleteOneItem(id) {
        await Request.sendRequest(`data.php?id=${id}`, {method: "DELETE"}).
        then(res => {
            console.log('delete item:', res);
        }).
        catch(e => {
            console.log(e)
        });
    }


    result() {
        //this.hre();

        this.getData().then(res => (res));

        //console.log(data);

        //return this.getData().then(res => res);

        //let r = data.then(res => res);
        //console.log(data);
        
        //return r;
    }
}

new Request().getAllData().then();
new Request().getOneItem(12).then();
new Request().deleteOneItem(12).then();











class Cart {
    constructor(props) {
        this.props = props;
    }

    static normalize(val) {
        let value = parseInt(val);
        let max = 10;
        let min = 1;
        if (isNaN(value) || value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        return value;

    }

    cartListGenerator(className) {

        const ul = document.createElement("ul");
        ul.classList.add(className);
        return ul;
    }

    cartListItemGenerator(item) {
        const li = document.createElement("li");
        li.classList.add(this.props.classes.item);

        const span = document.createElement("span");
        span.classList.add(this.props.classes.itemDesc);
        span.textContent = item.title;

        li.appendChild(span);

        const divWrapper = document.createElement("div");
        divWrapper.classList.add(this.props.classes.orderWrapper);

        const input = document.createElement("input");
        input.classList.add(this.props.classes.inputQuantity);
        input.type = "text";
        input.value = item.quantity;

        input.addEventListener("blur", function (evt) {
            input.value = Cart.normalize(input.value);
        });

        divWrapper.appendChild(input);

        const btn = document.createElement("button");
        btn.classList.add(...this.props.classes.btnDeleteItem.split(" "));
        btn.textContent = "Delete";

        btn.addEventListener("click", function (evt) {
            li.remove();
        });

        divWrapper.appendChild(btn);

        li.appendChild(divWrapper);
        return li;
    }


    render() {
        const ul = document.createElement("ul");
        ul.classList.add(this.props.classes.list);

        for (let item of this.props.dataItems) {
            let li = this.cartListItemGenerator(item);
            ul.appendChild(li)
        }
        return ul;
    }
}



// const list = new Cart(dataAll).render();
//
// const t = document.querySelector(".inner-list");
// t.appendChild(list);




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

























