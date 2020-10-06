"use strict";


/*
    Выставление рейтинга фильмам

    1. Принимаем на вход два селектора: первый - это набор всех блоков фильмов на странице, второй - селектор звезд для оценки.
    2. Начинаем обходить каждый из блоков, так как если забрать просто все иконки звезд, то они все разделят реакцию между собой.
    И именно поэтому второй селектор, селектор звезды, берет за точку отсчета не document, а отдельный элемент value (элемент фильма)
    Так каждую итерацию будут выбраны лишь 5 звезд для каждого отдельного блока, а не все 25-65-75 звезд на странице.
    3. Далее, обходим уже набор звезд отдельного элемента, каждой звезде присваивается дата-атрибут с инндеком данной звезды в наборе
    звезд для текущего элемента. Это нужно для того, чтобы знать от нулевого до какого элемента окрашивать звезду при клике/наведении.
    4. Запускаем цикл, от звезды с нулевым индексом до дата-атрибута с индексом элемента на котором произошло событие.
    "Меньше или равно" нужно, так как нужно включить и тот элемент, на котором произошло событие, а не только те, что идут до него.
    5. Выбраны разные классы для событий наведения и клика потому, что если при клике поставить класс, то при уходе мышки с элемента
    этот класс снимается, когда классы разные - класс клика остается.
================================
*/


function setMovieRate(allMoviesItemsSelector, movieItemIconsSelector) {

    const allMoviesItems = document.querySelectorAll(allMoviesItemsSelector);

    allMoviesItems.forEach(movieItem => {

        const movieIcons = movieItem.querySelectorAll(movieItemIconsSelector);
        movieIcons.forEach(value => {
            value.setAttribute("data-itemindex", [].indexOf.call(movieIcons, value));
            value.addEventListener("mouseover", function (evt) {
                for (let i = 0; i <= this.dataset.itemindex; i++) {
                    movieIcons[i].classList.add("movie-star--rate-hover");
                }
            });

            value.addEventListener("mouseout", function (evt) {
                for (let i = 0; i <= this.dataset.itemindex; i++) {
                    movieIcons[i].classList.remove("movie-star--rate-hover");
                }
            });

            value.addEventListener("click", function (evt) {
                evt.preventDefault();
                for (let i = 0; i <= this.dataset.itemindex; i++) {
                    movieIcons[i].classList.add("movie-star--rate-click");
                }
            });
        })
    });
}

setMovieRate(".tab-profile__rate",".movie-star");