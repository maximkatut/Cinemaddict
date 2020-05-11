import AbstractComponent from "./abstract-component.js";

const createPopupCommentsListTemplate = (comments) => {
  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.getComments().length}</span></h3>
      <ul class="film-details__comments-list">
      </ul>
    </section>`
  );
};

export default class PopupComments extends AbstractComponent {
  constructor(comments) {
    super();
    this._comments = comments;
  }

  getTemplate() {
    return createPopupCommentsListTemplate(this._comments);
  }

  getCommentsList() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }
}
