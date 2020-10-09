
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

    /**
     * Пример:
     * 1. Сайт лежит по адресу: text.ru/dist, на странице есть такая ссылка: <a href="table=admin&role=user"></a>
     * 2. Общий href тут будет такой: text.ru/dist/table=admin&role=user
     * 3. Обрезаем начиная справа до слеша(но без него), потом разбиваем по &, а потом по =, формируем обьект
     * 4. Также учитывая, что от условного text.ru/dist/table может понадобиться лишь table, а разделители & и = вообще не
     *    представлены, то метод может возвращать лишь обьект со свойством fullQuery и все.
     *
     * Разумеется, этот метод требует специфического формирования адресов ссылок, тут все для fetch изначально
     */
    static hrefParse(href) {
        const obj = {};
        obj.fullQuery = href.slice(href.lastIndexOf("/") + 1);
        if (href.indexOf("=") !== -1 || href.indexOf("&") !== -1) {
            href.slice(href.lastIndexOf("/") + 1).split("&").forEach(item => {
                obj[item.split("=")[0]] = item.split("=")[1];
            });
        }
        return obj;
    }

}


