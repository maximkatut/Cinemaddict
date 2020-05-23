import AbstractComponent from "./abstract-component.js";

const createPopupCommentsListTemplate = () => {
  return (
    `<section class="film-details__comments-wrap">
      <ul class="film-details__comments-list">
        <li class="film-details__comment preloader">
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

export default class PopupCommentsList extends AbstractComponent {
  constructor() {
    super();

  }

  getTemplate() {
    return createPopupCommentsListTemplate();
  }

  removePreload() {
    this.getElement().querySelector(`.preloader`).remove();
  }

  setNoDataTitle() {
    this.getElement().querySelector(`.film-details__comment-text`).innerText = `Something went wrong... Please reload page`;
  }

  getCommentsList() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }

  preloadData() {
    this.getElement().querySelector(`.preloader img`).classList.add(`spin`);
  }
}
