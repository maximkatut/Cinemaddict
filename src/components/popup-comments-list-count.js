import AbstractSmartComponent from "./abstract-smart-component.js";

const createPopupCommentsListCountTemplate = (comments) => {
  return (
    `<h3 class="film-details__comments-title">Comments 
      <span class="film-details__comments-count">${comments.length}</span>
    </h3>`
  );
};

export default class PopupCommentsListCount extends AbstractSmartComponent {
  constructor(comments) {
    super();
    this._comments = comments;
  }

  rerender(comments) {
    this._comments = comments;
    super.rerender();
  }

  getTemplate() {
    return createPopupCommentsListCountTemplate(this._comments);
  }

  recoveryListeners() {}
}
