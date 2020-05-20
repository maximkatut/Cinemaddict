import AbstractSmartComponent from "./abstract-smart-component.js";

const Title = {
  LOADING: `Loading...`,
  NODATA: `There are no movies in our database`,
};

const createFilmsBoardTemplate = (title) => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title">${title}</h2>
      </section>
    </section>`
  );
};

export default class FilmsBoard extends AbstractSmartComponent {
  constructor() {
    super();
    this._title = Title.LOADING;
  }

  getTemplate() {
    return createFilmsBoardTemplate(this._title);
  }

  deleteLoadingTitle() {
    this.getElement().querySelector(`.films-list`).remove();
  }

  setNoDataTitle() {
    this._title = Title.NODATA;
    this.rerender();
  }

  recoveryListeners() {}
}
