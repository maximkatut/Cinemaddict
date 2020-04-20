import AbstactComponent from "./abstract-component.js";

const createTopFilmsListsBoardTemplate = () => {
  return `<section class="films-list--extra films-list--top-rated">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      </div>
    </section>`;
};

export default class TopFilmsBoard extends AbstactComponent {
  getTemplate() {
    return createTopFilmsListsBoardTemplate();
  }
}
