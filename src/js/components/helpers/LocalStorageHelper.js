

export class LocalStorageHelper {
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


