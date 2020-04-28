import AbstactSmartComponent from "./abstract-smart-component.js";
import {formatTime, formatSlashDate} from "../utils/format.js";

const EmojiNames = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const createCommentsMarkup = (comment) => {
  const {content, author, date, emoji} = comment;

  const formatedDate = `${formatSlashDate(date)} ${formatTime(date)}`;
  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${content}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${formatedDate}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

const createCommentsEmojiMarkup = (emoji) => {
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`;
};

const createPopupCommentsTemplate = (comments) => {
  const commentsMarkup = comments.map((it) => createCommentsMarkup(it)).join(`\n`);
  const emojisMarkup = EmojiNames.map((it) => createCommentsEmojiMarkup(it)).join(`\n`);
  return (
    `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsMarkup}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
          <img class="film-details__image-emoji visually-hidden" width="55" height="55" alt="">
          </div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
          ${emojisMarkup}
          </div>
        </div>
      </section>`);
};

export default class PopupComments extends AbstactSmartComponent {
  constructor(comments) {
    super();
    this._comments = comments;
    this._changeEmojiHandler = null;

    this.recoveryListeners();
  }

  rerender() {
    super.rerender();
  }

  getTemplate() {
    return createPopupCommentsTemplate(this._comments);
  }

  setChangeEmojiClickHandler(handler) {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, handler);
    this._changeEmojiHandler = handler;
  }

  setNewCommentEmojiImg(emoji) {
    const emojiImg = this.getElement().querySelector(`.film-details__image-emoji`);
    emojiImg.classList.remove(`visually-hidden`);
    emojiImg.src = `images/emoji/${emoji}.png`;
    emojiImg.alt = `emoji-${emoji}`;
  }

  recoveryListeners() {
    this.setChangeEmojiClickHandler(this._changeEmojiHandler);
  }
}
