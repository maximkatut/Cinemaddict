import AbstractComponent from "./abstract-component.js";

const createNavigationMarkup = (filter, checked) => {
  let {name, count} = filter;
  if (name === `All movies`) {
    count = 0;
  }
  const hiddenClass = (count === 0) ? `visually-hidden` : ``;
  const activeClass = (checked) ? `main-navigation__item--active` : ``;
  return `<a href="#${name.toLowerCase()}" class="main-navigation__item ${activeClass}">${name} <span class="main-navigation__item-count ${hiddenClass}">${count}</span></a>`;
};

const createNavigationTemplate = (filters) => {
  const navigationMarkup = filters.map((filter) => {
    return createNavigationMarkup(filter, filter.checked);
  }).join(`\n`);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${navigationMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._currentFilterType = ``;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }
      const filterType = evt.target.innerText.split(/\s\d/)[0];
      if (this._currentFilterType === filterType) {
        return;
      }
      this._currentFilterType = filterType;
      handler(this._currentFilterType);
    });
  }

  setStatClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, handler);
  }
}
