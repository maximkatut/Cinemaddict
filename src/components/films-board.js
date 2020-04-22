import AbstactComponent from "./abstract-component.js";

const createFilmsBoardTemplate = () => {
  return `<section class="films"></section>`;
};

export default class FilmsBoard extends AbstactComponent {
  getTemplate() {
    return createFilmsBoardTemplate();
  }
}
