import AbstactComponent from "./abstract-component.js";

const createLoadMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class MoreButton extends AbstactComponent {
  getTemplate() {
    return createLoadMoreButtonTemplate();
  }
}
