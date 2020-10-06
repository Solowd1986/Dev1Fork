"use strict";

/*  Button add movie to watchlist
================================
*/
function addMovieToPlayList(btnAddMovieToPlaylistSelector) {

    const addMobitoWatchlistBtn = document.querySelector(btnAddMovieToPlaylistSelector);

    if (addMobitoWatchlistBtn !== null) {

        addMobitoWatchlistBtn.addEventListener("click", function () {
            const svgIconBtn = this.querySelector("use");
            const btnText = this.querySelector("span");

            svgIconBtn.href.baseVal = "#icon-in-playlist";
            btnText.textContent = "Добавлено в мой список";
            this.disabled = true;
            if (this.classList.contains("btn-scale-animation")) {
                this.classList.remove("btn-scale-animation");
            }
        });
    }
}

addMovieToPlayList(".btn-add-movie-to-playlist");