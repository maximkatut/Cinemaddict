import {createElement} from "../utils/render.js";
const createNavigationMarkup = (filter) => {
  const {name, count, isActive} = filter;
  const hiddenClass = (count === 0) ? `visually-hidden` : ``;
  const activeClass = (isActive) ? `main-navigation__item--active` : ``;
  return `<a href="#${name.toLowerCase()}" class="main-navigation__item ${activeClass}">${name} <span class="main-navigation__item-count ${hiddenClass}">${count}</span></a>`;
};

const createNavigationTemplate = (filters) => {
  const navigationMarkup = filters.map((filter) => {
    return createNavigationMarkup(filter);
  }).join(`\n`);
  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
        ${navigationMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
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
