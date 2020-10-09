
export class DomHelper {

    static create({tag, classes = [], text = ""} = {}) {
        const elem = document.createElement(tag);
        classes.length > 0 ? elem.classList.add(...classes) : null;
        text !== "" ? elem.innerText = text : null;
        return elem;
    }


    /**
     * 1. Передаем селекторы в виде обьекта или массиава
     * 2. В обоих случаях обходим содержимое, пытаясь выбрать элемент по данным селекторам
     * 3. Если в документе не представлено хоть одного селектора, то функция вернет false
     */
    static checkSelectors(data) {
        if (Array.isArray(data)) {
            return data.every(item => document.querySelector(item));
        } else if (data === Object(data)) {
            return Object.values(data).every(item => document.querySelector(item));
        } else {
            console.log("Переданные для проверки селекторы представлены не в виде обьекта или массива");
        }
    }

    static hrefParse(href) {
        const obj = {};
        obj.fullQuery = href.slice(href.lastIndexOf("/") + 1);
        href.slice(href.lastIndexOf("/") + 1).split("&").forEach(item => {
            obj[item.split("=")[0]] = item.split("=")[1];
        });
        return obj;
    }

}


