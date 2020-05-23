import {formatDate, formatTime} from '../utils/format.js';
import AbstractComponent from "./abstract-component.js";

const createPopupTemplate = (card) => {
  const {name, originalName, rating, director, writers, actors, releaseDate, ageRating, duration, genre, poster, country, description} = card;
  const formatedReleaseDate = formatDate(releaseDate);
  const formatedDuration = formatTime(duration);
  const createPopupGenreMarkup = (it) => {
    return `<span class="film-details__genre">${it}</span>`;
  };
  const genresMarkup = genre.map((it) => {
    return createPopupGenreMarkup(it);
  }).join(`\n`);
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${name}</h3>
                  <p class="film-details__title-original">Original: ${originalName}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating.toFixed(1)}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatedReleaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatedDuration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                ${genre.length === 0 ? `` : `<tr class="film-details__row">
                                              <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
                                              <td class="film-details__cell">
                                              ${genresMarkup}
                                            </tr>`}
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>
        </div>
        <div class="form-details__bottom-container">
        </div>
      </form>
    </section>`
  );
};

export default class Popup extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
  }
  getTemplate() {
    return createPopupTemplate(this._card);
  }

  getPopupCommentsContainer() {
    return this.getElement().querySelector(`.form-details__bottom-container`);
  }

  getPopupControlsContainer() {
    return this.getElement().querySelector(`.form-details__top-container`);
  }

  setClosePopupClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }
}
