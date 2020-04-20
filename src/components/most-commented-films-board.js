import AbstactComponent from "./abstract-component.js";

const createMostCommentedFilmsListsBoardTemplate = () => {
  return (`<section class="films-list--extra films-list--most-commented">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      </div>
    </section>`);
};

export default class MostCommentedFilmsBoard extends AbstactComponent {
  getTemplate() {
    return createMostCommentedFilmsListsBoardTemplate();
  }
}
