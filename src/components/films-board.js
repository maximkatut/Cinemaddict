import AbstractComponent from "./abstract-component.js";

const createFilmsBoardTemplate = () => {
  return `<section class="films"></section>`;
};

export default class FilmsBoard extends AbstractComponent {
  getTemplate() {
    return createFilmsBoardTemplate();
  }
}
