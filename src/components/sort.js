import AbstractComponent from "./abstract-component.js";

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeToDefault() {
    this.removeActiveClass();
    this._currentSortType = SortType.DEFAULT;
    this.addActiveClass();
  }

  removeActiveClass() {
    this.getElement().querySelector(`[data-sort-type = '${this._currentSortType}']`).classList.remove(`sort__button--active`);
  }

  addActiveClass() {
    this.getElement().querySelector(`[data-sort-type = '${this._currentSortType}']`).classList.add(`sort__button--active`);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this.removeActiveClass();
      evt.target.classList.add(`sort__button--active`);

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
