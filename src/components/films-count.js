import {createElement} from "../utils/render.js";

const createFilmsCountTemplate = (length) => {
  return `<p>${length} movies inside</p>`;
};

export default class FilmsCount {
  constructor(length) {
    this._length = length;
    this._element = null;
  }

  getTemplate() {
    return createFilmsCountTemplate(this._length);
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
