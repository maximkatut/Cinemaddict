import AbstactComponent from "./abstract-component.js";

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

export default class PopupBoard extends AbstactComponent {
  getTemplate() {
    return createPopupBoardTemplate();
  }

  setClosePopupClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close`).addEventListener(`click`, handler);
  }
}
