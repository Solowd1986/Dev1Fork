
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




class DataRequest {
    static sendFetch(url, options, responceType = "text") {
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
                return response[responceType]();
            }
        });
    }
}


let st = {
    "user" : "John", 
    "path" : "/",
    "expires" : "Tue, 19 Jan 2038 03:14:07 GMT"
};






const df = {days: 12, hours: 2, minutes: 30, seconds: 30};

function dateOffsetHelper(offset) {

    let dateInitial = Date.now();

    if ("days" in offset) {
        dateInitial += parseInt(offset.days) * 24 * 60 * 60 * 1000;
    }
    if ("hours" in offset) {
        dateInitial += parseInt(offset.hours) * 60 * 60 * 1000;
    }
    if ("minutes" in offset) {
        dateInitial += parseInt(offset.minutes) * 60 * 1000;
    }
    if ("seconds" in offset) {
        dateInitial += parseInt(offset.seconds) * 1000;
    }
    return new Date(dateInitial);
}






class CookieHelper {

    static hasCookie(cookieName) {
        if (document.cookie.length > 0) {
            return document.cookie.split(";").map(item => item.trim().match(/(?<name>.*?)=/).groups.name).includes(cookieName);
        } else {
            return  false;
        }
    }

    static cookieDateExpireHelper(milliseconds, toUTCString = false) {
        return !toUTCString
            ? new Date(milliseconds)
            : (new Date(milliseconds + Math.abs(new Date().getTimezoneOffset() * 60 * 1000))).toUTCString();
    }


    static getCookie(name) {
        if (CookieHelper.hasCookie(name)) {
            const cookieMatch = document.cookie.split(";").find(item => decodeURIComponent(item.trim().match(/(?<name>.*?)=/).groups.name) === name).split("=");
            try {
                const cookieParsedValue = JSON.parse(decodeURIComponent(cookieMatch[1]));
                return {name: decodeURIComponent(cookieMatch[0]), value: cookieParsedValue};
            } catch (e) {
                return {name: decodeURIComponent(cookieMatch[0]), value: decodeURIComponent(cookieMatch[1])};
            }
        } else {
            return false;
        }
    }

    static setCookie(name, value, options = {}) {
        let opt = "";
        if (Object.keys(options).length !== 0) {
            Object.keys(options).forEach((item, key, array) => {
                opt += (array.indexOf(item) + 1 !== array.length) ? item + "=" + options[item] + "; " : item + "=" + options[item] + "";
            });
        }
        //console.log(opt);
        document.cookie = `${encodeURIComponent(name)}= ${encodeURIComponent(JSON.stringify(value))};` + opt;
    }
}


//console.log('now', CookieHelper.cookieDateExpireHelper(Date.now() + 10800000, true));
//console.log(CookieHelper.hasCookie("ss"));




(function () {
    if (CookieHelper.hasCookie("auth")) {
        const data = CookieHelper.getCookie("auth");

        const au = document.querySelector(".user-auth");
        const form = document.querySelector(".form");
        form.replaceWith((UserAccountForm(data)));

    }
})();





function UserAccountForm(data) {

    const div = document.createElement("div");
    div.style.cssText = "padding: 5px 10px; margin: 20px auto; width: 30%; border: 2px solid black";
    const p = document.createElement("p");
    p.innerText = `Hello ${data.value.name}`;
    p.style.cssText = "margin-right: 10px";
    const button = document.createElement("button");
    button.innerText = "Exit";
    button.style.cssText = "background-color: red; color: white; padding: 2px 10px; align-self: center";

    div.append(p);
    div.append(button);

    return div;
}




function render(form) {
    if (CookieHelper.hasCookie("auth")) {
        const data = CookieHelper.getCookie("auth");

        console.log(data);

        // const div = document.createElement("div");
        // div.style.cssText = "padding: 5px 10px; margin: 20px auto; width: 30%; border: 2px solid black";
        // const p = document.createElement("p");
        // p.innerText = `Hello ${data.value.name}`;
        // p.style.cssText = "margin-right: 10px";
        // const button = document.createElement("button");
        // button.innerText = "Exit";
        // button.style.cssText = "background-color: red; color: white; padding: 2px 10px; align-self: center";


        const div = UserAccountForm(data);

        div.children[1].addEventListener("click", () => {
            userExit(data.name, div, form).then()
        });

        // div.append(p);
        // div.append(button);


        form.replaceWith(div);
    }
}


function ins($token) {
    const wrp = document.querySelector(".profile-block");
    const user = {name: "Bob"};
    const data = UserAuth.decodeSignedData($token);
    const p = document.createElement("p");
    (data.login !== "undefined") ? p.innerText = data.login : p.innerText = "John Doe";
    wrp.append(p);
}






class LocalStorageHelper {
    
    static getItem(key) {
        if (localStorage.getItem(key)) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return localStorage.getItem(key);
            }
        } else {
            console.log("Элемента с таким ключом в localStorage не найдено");
        }
    }


    static setItem(key, value) {
        if (localStorage.getItem(key)) {
            console.log("Элемент с таким ключом уже есть в localStorage");
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

}




async function userExit(name, div, form) {
    const responce = await Request.sendRequest("/dist/data.php", {
        method: "GET",
        headers: {
            "User-Exit": "auth"
        }
    });
    div.replaceWith(form);
}


const bresp = document.querySelector(".get-data");
const exitBtn = document.querySelector(".exit-data");
const answer = document.querySelector(".resp");

if (exitBtn && bresp) {
    exitBtn.addEventListener("click", function (evt) {
        if (localStorage.getItem("token-key")) {
            localStorage.removeItem("token-key");
        }
    });
    bresp.addEventListener("click", async function (evt) {
        if (localStorage.getItem("token-key")) {

            const reg = LocalStorageHelper.getItem("token-key");
            const ans = await UserAuth.tokenResponce(reg);


            if (UserAuth.decodeSignedData(ans).allowed) {
                if (UserAuth.decodeSignedData(ans)["has-expired"]) {
                    localStorage.removeItem("token-key");
                    console.log("token has removed like expired");
                } else {
                    console.log(UserAuth.decodeSignedData(ans));
                    const data = UserAuth.decodeSignedData(reg);
                    console.dir(data);
                    answer.innerText = data.login;
                }
            } else {
                localStorage.removeItem("token-key");
                answer.innerText = "User not auth";
            }
        } else {
            answer.innerText = "User not auth";
        }
    });


}







class ModalComponent {
    constructor(modalOptions) {
        this.options = modalOptions;
    }

    createOverlay(parentElement, childElement) {
        let elemOverlay = document.createElement("div");
        this.options.overlayClass ? elemOverlay.classList.add(this.options.overlayClass) : elemOverlay.style.csstest = "position: relative;";

        elemOverlay.addEventListener("click", function (evt) {
            this.remove();
            elemOverlay = null;
        });

        elemOverlay.append(childElement);
        parentElement.append(elemOverlay);
    }
}






const rootElem = document.querySelector(".db-responce-wrapper");
const rootOfRecords = document.querySelector(".admin__records-wrapper");

rootOfRecords.addEventListener("click", function (evt) {
    evt.preventDefault();
    console.dir(evt.target.href);



}, true);



class ListOfRecords {


    render() {

    }

}

class Edit {

    constructor (parent, data) {
        this.parent = parent;
        this.data = data;
    }

    render() {
        this.parent.classList.add("admin__form-wrapper");

        const h3 = document.createElement("h3");
        h3.classList.add("admin__title-of-element");
        h3.innerText = "Новый элемент";
        this.parent.append(h3);

        const form = document.createElement("form");
        form.classList.add("admin__new-elem-form");
        form.name = "admin__elem-form";


        for (const item in this.data) {
            const div = document.createElement("div");

            const label = document.createElement("label");
            label.innerText = item;
            div.append(label);

            const input = document.createElement("input");
            input.classList.add("admin__form-input");
            input.type = "text";
            input.name = `${item}`;
            input.value = `${this.data[item]}`;
            input.required = true;
            div.append(input);
            form.append(div);

        }


        const submit = document.createElement("input");
        submit.classList.add("admin__form-submit");
        submit.type = "submit";
        submit.name = "auth-submit";
        submit.value = "Send";

        form.append(submit);

        form.addEventListener("submit", function (evt) {
            evt.preventDefault();

        });
        this.parent.append(form);
    }
}


const dataSet = {name: "bob", id: 12};
const wrp = document.querySelector(".wrp");


new Edit(wrp, dataSet).render();




// <div class="admin__form-wrapper">
//     <h3 class="admin__title-of-element">Новый элемент</h3>
// <form class="admin__new-elem-form" action="/" name="admin__elem-form" method="POST">
//     <div>
//     <label for=""> Имя пользователя</label>
// <input class="admin__form-input" type="text" name="elem1" required>
// </div>
//
// <div>
// <label for=""> Адрес пользователя</label>
// <input class="admin__form-input" type="text" name="elem2" required>
// </div>
//
// <div class="admin__form-file">
//     <label for=""> Загружаемый файл</label>
// <input class="" type="file" name="file">
//     </div>
//     <input class="admin__form-submit" type="submit" name="auth-submit" value="Send">
//     </form>
//     </div>








rootElem.addEventListener("click", async function (evt) {
    evt.preventDefault();
    //console.dir(evt.target);

    if (evt.target.href && evt.target.href.includes("tablename")) {
        //console.log(evt.target.href);

        const request = await Request.sendRequest(`${evt.target.href.slice(evt.target.href.lastIndexOf("/") + 1)}`, {
            method: "GET"
        });

        try {
            //console.log(JSON.parse(request));
            const data = JSON.parse(request);

            rootOfRecords.innerHTML = "";

            const tableName = evt.target.href.match(/tablename=(?<name>.*)/).groups.name;

            const recordsAddBtn = document.createElement("a");
            recordsAddBtn.classList.add("admin__btn", "admin__add-item-btn");
            recordsAddBtn.href = `table=${tableName}&action=insert`;
            recordsAddBtn.innerText = "Добавить новый элемент";

            rootOfRecords.prepend(recordsAddBtn);


            const recordsTableTitle = document.createElement("h3");
            recordsTableTitle.classList.add("admin__table-title");
            recordsTableTitle.innerText = "Таблица: " + data.table;
            delete data.table;

            //rootOfRecords.prepend(recordsTableTitle);

            rootOfRecords.prepend(recordsTableTitle);



            const tableListOfElem = document.createElement("ul");
            tableListOfElem.classList.add("admin__list-of-records");

            //rootOfRecords.append(tableListOfElem);
            rootOfRecords.append(tableListOfElem);


            for (const item of Object.values(data)) {

                const li = document.createElement("li");

                for (const prop in item) {
                    const p = document.createElement("p");
                    p.classList.add("admin__field-record");
                    p.innerText = `${prop} : ${item[prop]}`;
                    li.append(p);
                }


                const divControlsWrapper = document.createElement("div");
                divControlsWrapper.classList.add("admin__table-controls");


                const ControlsBtnEdit = document.createElement("a");
                ControlsBtnEdit.classList.add("admin__btn", "admin__edit-item-btn");
                ControlsBtnEdit.innerText = "Edit";
                ControlsBtnEdit.href = `table=${tableName}&action=edit&id=${item["id"]}`;


                const ControlsBtnDelete = document.createElement("a");
                ControlsBtnDelete.classList.add("admin__btn", "admin__delete-item-btn");
                ControlsBtnDelete.href = `table=${tableName}&action=delete&id=${item["id"]}`;
                ControlsBtnDelete.innerText = "Delete";



                divControlsWrapper.append(ControlsBtnEdit, ControlsBtnDelete);
                li.append(divControlsWrapper);
                // for (let i = 12; i--;) {
                //     tableListOfElem.appendChild(li.cloneNode(true));
                // }
                tableListOfElem.append(li);
            }


        } catch (e) {
            console.log("error with get all tablees request", e.message + e.lineNumber);
        }

    }


}, true);


const rt = document.querySelector(".db-responce-wrapper");
const btnST = document.querySelector(".show-tables");
//const rootElem = document.querySelector(".admin__list-of-sections");

btnST.addEventListener("click", async function (evt) {
    evt.preventDefault();
    const request = await Request.sendRequest(`${evt.target.href.slice(evt.target.href.lastIndexOf("/") + 1)}`, {
        method: "GET"
    });

    try {
        rootElem.innerHTML = "";
        const ul = document.createElement("ul");
        ul.classList.add("admin__list-of-sections");
        JSON.parse(request).forEach(item => {


            const li = document.createElement("li");

            const link = document.createElement("a");
            link.classList.add("admin__btn");
            link.innerText = item.TABLE_COMMENT;
            link.href = `tablename=${item.TABLE_NAME}`;
            li.append(link);
            ul.append(li);
        });
        rootElem.append(ul);

    } catch (e) {
        console.log("error with get all tablees request", e.message);
    }
}, true);











class UserAuth {
    static decodeSignedData(str) {
        return JSON.parse(window.atob(str.substr(0, str.indexOf("|"))));
    }

    static async tokenResponce(token) {
        const tokenData = new FormData();
        tokenData.append("token", token);

        const options = {method: "POST", body: tokenData, headers: {
                'Token-Status': token,
            }};
        return await Request.sendRequest("data.php", options);
    }

    static formHandler(form) {
        if (form !== null && form.nodeType === 1 && form.nodeName === "FORM") {
            form.addEventListener("submit", async function (evt) {
                evt.preventDefault();

                const formDataSet = new FormData(evt.target);
                const options = {method: "POST", body: formDataSet, headers: {
                        'Data-Type': 'fetch/form-data',
                    }};


                try {
                    if (!Request.hasPersistentHeader("dame")) {
                        Request.definePersistentHeaders({dame: "next"},options)
                    }

                    const responce = await Request.sendRequest(form.action.match(/\..*?(?<action>\/.*)/).groups.action, options);



                    const div = document.querySelector(".result");

                    //div.innerHTML = responce;

                    div.innerHTML = UserAuth.decodeSignedData(responce);

                    ins(responce);
                    LocalStorageHelper.setItem("token-key", responce);
                    
                    console.log(UserAuth.decodeSignedData(responce));

                    //const ch2 = await UserAuth.tokenResponce(responce);
                    //console.dir(ch2);

                } catch (e) {
                    console.log("error when request to form:" ,e);
                }
            });
        }
    }
}



UserAuth.formHandler(document.querySelector(".form"));







class Request {

    static persistentHeaders = {};

    static definePersistentHeaders(headers, options) {
        for (const item in headers) {
            this.persistentHeaders[item] = headers[item];
        }
    }

    static hasPersistentHeader(headerName) {
        return headerName in this.persistentHeaders;
    }


    static sendRequest(url, options) {

        // Выносим сюда авторизацию, то есть каждый запрос отправит такой заголовок. Добавляем обьекту options обьект headers, на случай, если
        // запрос заголовков вообще не передал. Это чтоб пустому обьекту не присвоить заголовок.

        if (!('headers' in options)) {
          options.headers = {};
        }

        if (this.persistentHeaders) {
            for (const item in this.persistentHeaders) {
                options.headers[item] = this.persistentHeaders[item];
            }
        }

        //options.headers.authUser = "dsferewqrwer";


        let controller = new AbortController();
        setTimeout(() => controller.abort(), 4000);
        options.signal = controller.signal;

        /**
         * Тут исходим из того, что в url параметр передали /, при этом в href может быть что-то другое,
         * это нужно проверять на стороне запроса их функции
         * @type {string}
         */
        url = url === "/" ? "/dist/data.php" : "/dist/data.php?" + url;

        
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

            function decodeSignedData(str) {
                return JSON.parse(window.atob(str.substr(0, str.indexOf("|"))));
            }


            function isJson(item) {
                item = typeof item !== "string"
                    ? JSON.stringify(item)
                    : item;

                try {
                    item = JSON.parse(item);
                } catch (e) {
                    return false;
                }

                return (typeof item === "object" && item !== null);
            }



            form.addEventListener("submit", function (evt) {
                evt.preventDefault();
                //console.dir(this);

                let formDataSet = new FormData(form);
                let options = {method: "POST", body: formDataSet, headers: {
                        'Data-Type': 'user-form',
                    }};
                Request.sendRequest("/dist/data.php", options).then(
                    res => {

                        //let y = JSON.parse(decodeSignedData(res));
                        //console.log(decodeSignedData(res));
                        

                        //let t = document.querySelector(".result");
                        //t.innerHTML += res;
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

//new Request().addOneItem().then();
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




























