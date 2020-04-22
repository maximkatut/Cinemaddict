import {formatDate} from "../utils/format.js";
import AbstactComponent from "./abstract-component.js";

const createPopupInfoTemplate = (card) => {
  const {name, originalName, rating, director, writers, actors, releaseDate, ageRating, duration, genre, poster, country, description, isInWatchlist, isWatched, isFavorite} = card;
  const formatReleaseDate = formatDate(releaseDate);
  const checkIsActive = (boolean) => {
    return boolean ? `checked` : ``;
  };
  const createPopupGenreMarkup = (it) => {
    return `<span class="film-details__genre">${it}</span>`;
  };

  const genresMarkup = genre.map((it) => {
    return createPopupGenreMarkup(it);
  }).join(`\n`);

  return (
    `<div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name}</h3>
              <p class="film-details__title-original">Original: ${originalName}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
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
              <td class="film-details__cell">${formatReleaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
              ${genresMarkup}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>
    </div>
    <section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${checkIsActive(isInWatchlist)}>
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${checkIsActive(isWatched)}>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${checkIsActive(isFavorite)}>
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>`);
};
export default class PopupInfo extends AbstactComponent {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createPopupInfoTemplate(this._card);
  }

  setClosePopupClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close`).addEventListener(`click`, handler);
  }
}
