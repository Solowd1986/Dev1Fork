
export class DateHelper {

    /**
     *  Данный метод получает на вход обьект следующего вида, поля опциональны:
     *  const offset = {days: 12, hours: 2, minutes: 30, seconds: 30}
     *  В результате возвращается текущая дата + переданное смещение, например, + 2 часа или + 2 дня
     */
    static dateOffset(offset) {

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
}


