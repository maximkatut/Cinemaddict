import AbstractComponent from "./abstract-component.js";

const createFilmsCountTemplate = (filmsCount) => {
  return `<p>${filmsCount} movies inside</p>`;
};

export default class FilmsCount extends AbstractComponent {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFilmsCountTemplate(this._filmsCount);
  }
}
