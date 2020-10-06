"use strict";


const smoothScrollToCategories = () => {


    if (window.location.pathname === '/') {

        /*  Данная функция забирает список ссылок на выбранные элементы, и при клике на каждый рассчитывает расстояние от них
            до верхней границы viewport по оси Y, после чего мягко прокручивает окно до положения выбранного элемента.

            Чтобы не допустить повторную прокрутку при клике на категорию, выполняется повторная проверка на величину btnYOffset, уже
            когда мы прокрутили до нужного элемента. Теперь в этой переменной будет 0, так как элемент окажется прижат к верхней границе
            viewport, а значит, отступ до него равен 0, но браузер иногда возвращает нецелое число, а скажем, 0.345666, это больше нуля
            и условие не работает как нужно, позволяя повторную прокрутку. Для предотвращения этого и используется trunc.

            Для чего складываем:
            window.scrollY - вернет количество пикселей, которые были прокручены, это количество считается от верха документа до верхнего
            края viewport-а.
            btnYOffset - вернет количество пикселей от края viewport-а до верха элемента.
            Складываем - получаем общее количество пикселей, которые нужно прокрутить до того, чтобы верх viewport-а
            был прижат к целевому элементу, это достигается через передачи нужных координат scrollTo, этот метод как раз прокручивает
            viewport к нужным координатам.
        ================================
        */
        function scrollToElement(elementSelector) {
            const categoriesBtnList = document.querySelectorAll(elementSelector);

            categoriesBtnList.forEach(value => value.addEventListener("click", function (evt) {
                evt.preventDefault();
                const btnYOffset = this.getBoundingClientRect().top;

                if (Math.trunc(btnYOffset) > 0) {
                    window.scrollTo({
                        top: btnYOffset + window.scrollY,
                        behavior: "smooth"
                    })
                }
                
            }));
        }
        scrollToElement(".categories a");
    }
};


//export default smoothScrollToCategories;

export default (function () {

})();

