import {createElement} from "../utils/render.js";

const createFilmCardTemplate = (card) => {
  const {name, rating, releaseDate, duration, genre, poster, description, comments, isInWatchlist, isWatched, isFavorite} = card;
  const releaseYear = releaseDate.getFullYear();
  const shortDescription = description.length > 140 ? `${description.slice(0, 139)}…` : description;
  const checkIsActive = (statement) => {
    return statement ? `film-card__controls-item--active` : ``;
  };
  return (`<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${checkIsActive(isInWatchlist)}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${checkIsActive(isWatched)}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${checkIsActive(isFavorite)}">Mark as favorite</button>
      </form>
    </article>`);
};

export default class Card {
  constructor(card) {
    this._card = card;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
