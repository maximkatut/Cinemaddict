import AbstractSmartComponent from "./abstract-smart-component.js";

const EmojiNames = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const createCommentsEmojiMarkup = (emoji, isChecked) => {
  const checked = isChecked ? `checked` : ``;
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${checked}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  );
};

const createPopupCommentsTemplate = (comments, options = {}) => {
  const {selectedEmoji} = options;
  const emojisMarkup = EmojiNames.map((it) => {
    let isChecked = false;
    if (it === selectedEmoji) {
      isChecked = true;
    }
    return createCommentsEmojiMarkup(it, isChecked);
  }).join(`\n`);
  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">
          <img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
        ${emojisMarkup}
        </div>
      </div>
    </section>`
  );
};

export default class PopupComments extends AbstractSmartComponent {
  constructor(comments) {
    super();
    this._comments = comments;
    this._changeEmojiHandler = null;
    this._selectedEmoji = `smile`;

    this.recoveryListeners();
  }

  getTemplate() {
    return createPopupCommentsTemplate(this._comments, {
      selectedEmoji: this._selectedEmoji,
    });
  }

  getCommentsList() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }

  setChangeEmojiClickHandler(handler) {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, handler);
    this._changeEmojiHandler = handler;
  }

  setNewCommentEmojiImg(emoji) {
    this._selectedEmoji = emoji;
  }

  recoveryListeners() {
    this.setChangeEmojiClickHandler(this._changeEmojiHandler);
  }
}
