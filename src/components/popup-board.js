import {createElement} from "../utils/render.js";

const createPopupBoardTemplate = () => {
  return (`<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
        </div>
      </form>
    </section>`);
};

export default class PopupBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPopupBoardTemplate();
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
