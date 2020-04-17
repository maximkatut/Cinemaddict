import {createElement} from "../utils/render.js";

const createMostCommentedFilmsListsBoardTemplate = () => {
  return (`<section class="films-list--extra films-list--most-commented">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      </div>
    </section>`);
};

export default class MostCommentedFilmsBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMostCommentedFilmsListsBoardTemplate();
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
