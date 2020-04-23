import AbstactComponent from "./abstract-component.js";

const createFilmsListTemplate = (title, visibleClass, filmsListClass) => {
  return (
    `<section class="${filmsListClass}">
      <h2 class="films-list__title ${visibleClass}">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>`);
};

export default class FilmsList extends AbstactComponent {
  constructor(title, isTitleVisible, isExtra) {
    super();
    this._title = title;
    this._isTitleVisible = isTitleVisible;
    this._isExtra = isExtra;
    this._visibleClass = isTitleVisible ? `` : `visually-hidden`;
    this._filmsListClass = isExtra ? `films-list--extra` : `films-list`;
  }

  setNewTitle(newTitle, isTitleVisible) {
    this._visibleClass = isTitleVisible ? `` : `visually-hidden`;
    this._title = newTitle;
  }

  getListInnerElement() {
    return this.getElement().querySelector(`.films-list__container`);
  }

  getTemplate() {
    return createFilmsListTemplate(this._title, this._visibleClass, this._filmsListClass);
  }
}
