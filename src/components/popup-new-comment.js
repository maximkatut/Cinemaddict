import AbstractSmartComponent from "./abstract-smart-component.js";
import {encode} from "he";
import {SHAKE_ANIMATION_TIMEOUT} from '../const.js';

export const EmojiNames = {
  SMILE: `smile`,
  SLEEPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`,
};

const INPUT_COLOR_TIMEOUT = 1200;

const createCommentsEmojiMarkup = (emoji, isChecked) => {
  const checked = isChecked ? `checked` : ``;
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${checked}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  );
};

const createPopupCommentsTemplate = (options = {}) => {
  const {selectedEmoji, newCommentText} = options;
  const encodedCommentText = encode(newCommentText);
  const emojisMarkup = Object.values(EmojiNames).map((emojiName) => {
    let isChecked = false;
    if (emojiName === selectedEmoji) {
      isChecked = true;
    }
    return createCommentsEmojiMarkup(emojiName, isChecked);
  }).join(`\n`);
  return (
    `<div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label">
        <img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">
      </div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${encodedCommentText}</textarea>
      </label>

      <div class="film-details__emoji-list">
      ${emojisMarkup}
      </div>
    </div>`
  );
};

export default class PopupNewComment extends AbstractSmartComponent {
  constructor() {
    super();

    this._changeEmojiHandler = null;
    this._changeNewCommentHandler = null;
    this._submitHandler = null;

    this._selectedEmoji = EmojiNames.SMILE;
    this._newCommentText = ``;
  }

  getTemplate() {
    return createPopupCommentsTemplate({
      selectedEmoji: this._selectedEmoji,
      newCommentText: this._newCommentText,
    });
  }

  getCommentsList() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }

  setChangeEmojiClickHandler(handler) {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, handler);
    this._changeEmojiHandler = handler;
  }

  setInputStatus(isDisabled) {
    const input = this.getElement().querySelector(`.film-details__comment-input`);
    input.disabled = isDisabled;
    if (isDisabled) {
      input.style.backgroundColor = `rgb(190, 190, 190)`;
    } else {
      input.style.backgroundColor = `rgb(216, 118, 120)`;
      setTimeout(() => {
        input.style.backgroundColor = `rgb(256, 256, 256)`;
      }, INPUT_COLOR_TIMEOUT);
    }
  }

  setNewCommentInputChangeHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keyup`, handler);
    this.getElement().querySelector(`.film-details__comment-input`).focus({preventScroll: true});
    this._changeNewCommentHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, (evt) => {
      if (evt.target.value !== ``) {
        const isKey = (evt.key === `Enter` && (evt.ctrlKey || evt.metaKey));
        if (isKey) {
          handler(null, Object.assign({}, {
            id: String(new Date() + Math.random()),
            content: this._newCommentText,
            author: `kto-to`,
            date: new Date(),
            emoji: this._selectedEmoji,
          }));
        }
      }
    });
    this._submitHandler = handler;
  }

  setNewCommentText(text) {
    this._newCommentText = text;
  }

  setNewCommentEmojiImg(emoji) {
    this._selectedEmoji = emoji;
  }

  recoveryListeners() {
    this.setChangeEmojiClickHandler(this._changeEmojiHandler);
    this.setNewCommentInputChangeHandler(this._changeNewCommentHandler);
    this.setSubmitHandler(this._submitHandler);
  }

  shake() {
    this.getElement().classList.add(`shake`);
    setTimeout(() => {
      this.getElement().classList.remove(`shake`);
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
