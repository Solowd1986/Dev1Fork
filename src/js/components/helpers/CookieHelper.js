

export class CookieHelper {


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
        document.cookie = `${encodeURIComponent(name)}= ${encodeURIComponent(JSON.stringify(value))};` + opt;
    }
}

