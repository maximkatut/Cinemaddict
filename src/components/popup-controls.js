import AbstractSmartComponent from "./abstract-smart-component.js";

const createPopupTemplate = (card) => {
  const {isInWatchlist, isWatched, isFavorite} = card;
  const checkIsActive = (boolean) => {
    return boolean ? `checked` : ``;
  };
  return (
    `<section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${checkIsActive(isInWatchlist)}>
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${checkIsActive(isWatched)}>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${checkIsActive(isFavorite)}>
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>`
  );
};

export default class PopupControls extends AbstractSmartComponent {
  constructor(card) {
    super();
    this._card = card;

    this._watchlistClickHandler = null;
    this._watchedClickHandler = null;
    this._favoriteClickHandler = null;
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

  getTemplate() {
    return createPopupTemplate(this._card);
  }

  setWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
    .addEventListener(`click`, handler);
    this._watchlistClickHandler = handler;
  }

  setWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
    .addEventListener(`click`, handler);
    this._watchedClickHandler = handler;
  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
    .addEventListener(`click`, handler);
    this._favoriteClickHandler = handler;
  }

  setControlButtonsDisabledStatus(boolean) {
    this.getElement().querySelectorAll(`.film-details__control-input`).forEach((button) => {
      button.disabled = boolean;
    });
  }
}
