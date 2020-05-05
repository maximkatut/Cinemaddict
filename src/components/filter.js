import AbstactComponent from "./abstract-component.js";

const createNavigationMarkup = (filter) => {
  const {name, count, checked} = filter;

  const hiddenClass = (count === 0) ? `visually-hidden` : ``;
  const activeClass = (checked) ? `main-navigation__item--active` : ``;
  return `<a href="#${name.toLowerCase()}" class="main-navigation__item ${activeClass}">${name} <span class="main-navigation__item-count ${hiddenClass}">${count}</span></a>`;
};

const createNavigationTemplate = (filters) => {
  const navigationMarkup = filters.map((filter) => {
    return createNavigationMarkup(filter);
  }).join(`\n`);
  return `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${navigationMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
};

export default class Filter extends AbstactComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
  }
}
