import {createElement} from "../utils/render.js";

const createTopFilmsListsBoardTemplate = () => {
  return `<section class="films-list--extra films-list--top-rated">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      </div>
    </section>`;
};

export default class TopFilmsBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTopFilmsListsBoardTemplate();
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
