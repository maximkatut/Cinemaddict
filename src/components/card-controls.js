import AbstractSmartComponent from "./abstract-smart-component.js";

const createFilmCardControlButtonsTemplate = (card) => {
  const {isInWatchlist, isWatched, isFavorite} = card;
  const checkIsActive = (statement) => statement ? `film-card__controls-item--active` : ``;
  return (
    `<form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${checkIsActive(isInWatchlist)}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${checkIsActive(isWatched)}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${checkIsActive(isFavorite)}">Mark as favorite</button>
    </form>`
  );
};

export default class CardControls extends AbstractSmartComponent {
  constructor(card) {
    super();
    this._card = card;

    this._watchlistClickHandler = null;
    this._watchedClickHandler = null;
    this._favoriteClickHandler = null;
  }

  getTemplate() {
    return createFilmCardControlButtonsTemplate(this._card);
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

  rerender(card) {
    this._card = card;
    super.rerender();
  }

  setControlButtonsDisabledStatus(isDisabled) {
    this.getElement().querySelectorAll(`.button`).forEach((button) => {
      button.disabled = isDisabled;
    });
  }
}
