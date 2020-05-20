import AbstractComponent from "./abstract-component.js";

const createPopupCommentsListTemplate = (comments) => {
  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      <ul class="film-details__comments-list">
        <li class="film-details__comment placeholder">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/circle.png" width="55" height="55" alt="circle-preloader">
          </span>
          <div>
            <p class="film-details__comment-text">Loading...</p>
          </div>
        </li>
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

  removePreloadingPlaceholder() {
    this.getElement().querySelector(`.placeholder`).remove();
  }

  setNoDataTitle() {
    this.getElement().querySelector(`.film-details__comment-text`).innerText = `Something went wrong... Please reload page`;
  }

  getCommentsList() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }
}
