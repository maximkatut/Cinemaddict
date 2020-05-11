import AbstractComponent from "./abstract-component.js";
import {formatTime} from '../utils/format.js';

const createFilmCardControlButtonsTemplate = (card) => {
  const {isInWatchlist, isWatched, isFavorite} = card;
  const checkIsActive = (statement) => statement ? `film-card__controls-item--active` : ``;
  return (
    `<button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${checkIsActive(isInWatchlist)}">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${checkIsActive(isWatched)}">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${checkIsActive(isFavorite)}">Mark as favorite</button>`
  );
};

const createFilmCardTemplate = (card) => {
  const {name, rating, releaseDate, duration, genre, poster, description, comments} = card;
  const releaseYear = releaseDate.getFullYear();
  const formatedDuration = formatTime(duration);
  const shortDescription = description.length > 140 ? `${description.slice(0, 139)}…` : description;
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${formatedDuration}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        ${createFilmCardControlButtonsTemplate(card)}
      </form>
    </article>`
  );
};

export default class Card extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
    // this.recoveryListeners();
    this._watchlistClickHandler = null;
    this._watchedClickHandler = null;
    this._favoriteClickHandler = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  getControlButtonsTemplate(card) {
    return createFilmCardControlButtonsTemplate(card);
  }

  setOpenPopupClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  setWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
    .addEventListener(`click`, handler);
    this._watchlistClickHandler = handler;

  }

  setWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
    .addEventListener(`click`, handler);
    this._watchedClickHandler = handler;

  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
    .addEventListener(`click`, handler);
    this._favoriteClickHandler = handler;
  }

  recoveryListeners() {
    this.setWatchlistClickHandler(this._watchlistClickHandler);
    this.setWatchedClickHandler(this._watchedClickHandler);
    this.setFavoriteClickHandler(this._favoriteClickHandler);
  }

  update(card) {
    if (card.isFavorite !== this._card.isFavorite || card.isInWatchlist !== this._card.isInWatchlist || card.isWatched !== this._card.isWatched) {
      const filmCardControlsElement = this.getElement().querySelector(`.film-card__controls`);
      filmCardControlsElement.innerHTML = this.getControlButtonsTemplate(card);
    }

    if (card.comments !== this._card.comments) {
      this.getElement().querySelector(`.film-card__comments`).innerHTML = `${card.comments.length} comments`;
    }

    this.recoveryListeners();
  }
}
