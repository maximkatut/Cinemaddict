import AbstactComponent from "./abstract-component.js";

const createNoCardsTemplate = () => {
  return `<h2 class="films-list__title">There are no movies in our database</h2>`;
};

export default class NoCards extends AbstactComponent {
  getTemplate() {
    return createNoCardsTemplate();
  }
}
