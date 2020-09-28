
import "normalize.css";
import "../assets/scss/main.scss";
import "@babel/polyfill";


require.context('../assets/img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);




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

const userToken = {
  uid: 3456,
  role: "user"
};













class Request {

    static sendRequest(url, options) {

        // Выносим сюда авторизацию, то есть каждый запрос отправит такой заголовок. Добавляем обьекту options обьект headers, на случай, если
        // запрос заголовков вообще не передал. Это чтоб пустому обьекту не присвоить заголовок.
        if (!('headers' in options)) {
          options.headers = {};
        }
        options.headers.authUser = "dsferewqrwer";



        let controller = new AbortController();
        setTimeout(() => controller.abort(), 4000);
        options.signal = controller.signal;

        return fetch(url, options).then(response => {
            if (!response.ok) {
                return response.text().then(error => {
                    throw new Error(`HTTP Request Error\nStatus: ${response.status}\nMessage: ${error.match(/<pre>(?<errorMsg>.*)<\/pre>/i) !== null 
                        ? error.match(/<pre>(?<errorMsg>.*)<\/pre>/i).groups.errorMsg
                        : response.statusText}`);
                });
            } else {
                return response.text();
            }
        });
    }

    static rootElementGenerator(rootSelector, appendData) {
        if (document.querySelector(rootSelector) !== -1) {
            const root = document.querySelector(rootSelector);

            const h3 = document.createElement("h3");
            h3.innerText = "All data";
            h3.style.cssText = "text-align: center";
            root.append(h3);

            const ul = document.createElement("ul");

            appendData.forEach(item => {
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
            return root;
        }
    }

    async getAllData() {
        try {
            const request = await Request.sendRequest(`data.php`, {method: "GET"});
            const result = JSON.parse(request);
            Request.rootElementGenerator(".result", [result]);

        } catch (e) {
            console.log(e.message);
        }


        // try {
        //     const result = JSON.parse(request);
        //     Request.rootElementGenerator(".result", [result]);
        // } catch (e) {
        //     console.log("Error:",e.message, "in getAllData");
        //     console.log('res', request ? request : !!request);
        // }
    }


    async getOneItem(id) {
        const request = await Request.sendRequest(`data.php?id=${id}`, {method: "GET"});
        try {
            const result = JSON.parse(request);

            const d = document.querySelector(".result");
            //d.innerHTML = request;
            //console.log(request);
            console.log(result);
            

            Request.rootElementGenerator(".result", [result]);
        } catch (e) {
            console.log('catch res', request.length > 0 ? request : !!request);
        }
    }

    async deleteOneItem(id) {
        const request = await Request.sendRequest(`data.php?id=${id}`, {method: "DELETE"});
        try {
            const result = JSON.parse(request);
            Request.rootElementGenerator(".result", result);
        } catch (e) {
            console.log('res', request.length > 0 ? request : !!request);
        }
    }


    async addOneItem() {
        const data = {name: "stam", email: "trenf@yandex.ru", psw: "1234"};

        const data2 = [
            {
                title: "Nokia",
                price: 4000,
                quantity: 1,
                color: "black"
            },
            {
                title: "Motorola",
                price: 14000,
                quantity: 3,
                color: "red"
            },
            {
                title: "LG",
                price: 12000,
                quantity: 4,
                color: "blue"
            },
        ];

        const data3 = {
            data: {
                title: "Nokia",
                price: 4000,
                quantity: 1,
                color: "black"
            }
        };


        const formData = new FormData();

        for (const field in data) {
            formData.append(field, data[field])
        }


        let datasend = new URLSearchParams(JSON.stringify(data2)).toString();
        let datasend2 = JSON.stringify(data3);


        //console.log(datasend);
        //console.log(datasend2);

        const dataSet = {
            name: "bob",
            age: 21,
            floor: 4
        };
        
        //const newObj = Object.assign({}, dataSet);
        const picked = (({ age, floor }) => ({ age, floor }))(dataSet);

        console.log(picked);
        
        



        function addTokenToLocalStorage(token) {
            if (!localStorage.getItem(token.tokenTitle)) {
                localStorage.setItem(token.tokenTitle, JSON.stringify((({ tokenId, tokenExpire }) => ({ tokenId, tokenExpire }))(token)));
            } else {
                const tokenData = (({ tokenId, tokenExpire }) => ({ tokenId, tokenExpire }))(token);

                // console.log('get');
                // console.log(tokenData.tokenExpire);
                // console.log(new Date().getTime());
                // console.log(Date.now());

                if (tokenData.tokenExpire < Date.now()) {
                    console.log(tokenData.tokenExpire);
                    console.log(new Date().getTime());
                    console.log(Date.now());
                    console.log('token expire');
                }
                //console.log(tokenData);
            }
        }



        try {
            const request = await Request.sendRequest(`data.php`, {method: "POST", body: formData,
                // headers: {
                //     'Content-Type': 'application/x-www-form-urlencoded',
                // }
            });

            //let t = document.querySelector(".result");
            //t.innerHTML = request;

            //const result = JSON.parse(request);
            //Request.rootElementGenerator(".result", [result]);

            const form = document.querySelector(".form");

            form.addEventListener("submit", function (evt) {
                evt.preventDefault();
                //console.dir(this);

                let formDataSet = new FormData(form);
                let options = {method: "POST", body: formDataSet, headers: {
                        'Data-Type': 'user-form',
                    }};
                Request.sendRequest("/dist/data.php", options).then(
                    res => {
                        let t = document.querySelector(".result");
                        t.innerHTML += res;
                        //console.log(res);
                    });


            });




            //addTokenToLocalStorage(result);


            //localStorage.setItem('token', JSON.stringify((({ tokenId, tokenExpire }) => ({ tokenId, tokenExpire }))(result)));
        } catch (e) {
            console.log(e.message);
        }
    }
}



const responce = new Request();
//responce.getAllData().then();

new Request().addOneItem().then();
//new Request().getOneItem(12).then();
//new Request().deleteOneItem(12).then();















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

























