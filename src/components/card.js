import AbstractSmartComponent from "./abstract-smart-component.js";
import {formatTime} from '../utils/format.js';

const DESCRIPTION_MAX_LENGTH = 140;

const createFilmCardTemplate = (card) => {
  const {name, rating, releaseDate, duration, genres, poster, description, comments} = card;
  const releaseYear = releaseDate.getFullYear();
  const formatedDuration = formatTime(duration);
  const shortDescription = description.length > DESCRIPTION_MAX_LENGTH ? `${description.slice(0, DESCRIPTION_MAX_LENGTH - 1)}…` : description;
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating.toFixed(1)}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${formatedDuration}</span>
        <span class="film-card__genre">${!genres[0] ? `` : genres[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
    </article>`
  );
};

export default class Card extends AbstractSmartComponent {
  constructor(card) {
    super();
    this._card = card;
    this._openPopupHandler = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  setOpenPopupClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
    this._openPopupHandler = handler;
  }

  recoveryListeners() {
    this.setOpenPopupClickHandler(this._openPopupHandler);
  }

  rerender(card) {
    this._card = card;
    super.rerender();
  }
}
