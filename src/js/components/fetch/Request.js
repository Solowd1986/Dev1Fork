

export class Request {
    static send(url, options, responceType = "text") {
        // Выносим сюда авторизацию, то есть каждый запрос отправит такой заголовок. Добавляем обьекту options обьект headers, на случай, если
        // запрос заголовков вообще не передал. Это чтоб пустому обьекту не присвоить заголовок.

        if (!('headers' in options)) {
            options.headers = {};
        }
        //options.headers.authUser = "<random_key>";


        let controller = new AbortController();
        setTimeout(() => controller.abort(), 4000);
        options.signal = controller.signal;

        /**
         * "/" - отправка данных без GET-параметров
         * "table=admin&role=guest" - так передаются GET-параметры, они будут приклеены к стандартному запросу
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
                return response[responceType]();
            }
        });
    }
}


