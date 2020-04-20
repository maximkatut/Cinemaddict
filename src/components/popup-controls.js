import AbstactComponent from "./abstract-component.js";

const createPopupControlsTemplate = (card) => {
  const {isInWatchlist, isWatched, isFavorite} = card;
  const checkIsActive = (statement) => {
    return statement ? `checked` : ``;
  };
  return (`<section class="film-details__controls">
    <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${checkIsActive(isInWatchlist)}>
    <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

    <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${checkIsActive(isWatched)}>
    <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

    <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${checkIsActive(isFavorite)}>
    <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
  </section>`);
};
export default class PopupControls extends AbstactComponent {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createPopupControlsTemplate(this._card);
  }
}
