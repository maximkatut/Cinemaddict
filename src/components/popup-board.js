import AbstactComponent from "./abstract-component.js";

const createPopupBoardTemplate = () => {
  return (`<section class="film-details">
      <form class="film-details__inner" action="" method="get">
      </form>
    </section>`);
};

export default class PopupBoard extends AbstactComponent {
  getTemplate() {
    return createPopupBoardTemplate();
  }

  getBoardInnerElement() {
    return this.getElement().querySelector(`.film-details__inner`);
  }
}
