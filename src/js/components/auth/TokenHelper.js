
export class TokenHelper {

    /**
     *  Получаем на вход токен, при отправке с сервера он кодируется через json_endode, а потом через base64
     *  Поэтому тут мы сначала декодируем base64 через window.atob, забрав информационну часть токена (до сепаратора)
     *  А потом разбираем данные как json
     */
    static decode(token) {
        try {
            return JSON.parse(window.atob(token.substr(0, token.indexOf("|"))));
        } catch (e) {
            console.log("Ошибка при декодировании токена", e.message);

        }
    }
}


