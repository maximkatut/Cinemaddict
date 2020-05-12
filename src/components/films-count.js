import AbstractComponent from "./abstract-component.js";

const createFilmsCountTemplate = (length) => {
  return `<p>${length} movies inside</p>`;
};

export default class FilmsCount extends AbstractComponent {
  constructor(length) {
    super();
    this._length = length;
  }

  getTemplate() {
    return createFilmsCountTemplate(this._length);
  }
}
