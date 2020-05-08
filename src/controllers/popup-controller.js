import PopupComponent from "../components/popup.js";
import PopupControlsComponent from "../components/popup-controls.js";
import PopupCommentsComponent from "../components/popup-comments.js";
import CommentController from "../controllers/comment-controller.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

const renderComments = (container, comments, onCommentsDataChange) => {
  return comments.map((comment) => {
    const commentController = new CommentController(container, onCommentsDataChange);
    commentController.render(comment);
    return commentController;
  });
};

export default class PopupController {
  constructor(onDataChange, onViewChange) {
    this._card = {};
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._popupComponent = null;
    this._popupControlsComponent = null;
    this._popupCommentsComponent = null;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);

    this._selectedEmoji = ``;
  }

  render(card) {
    this._card = card;
    // Find body element for rendering popup card
    const siteBodyElement = document.querySelector(`body`);
    const oldPopupComponent = this._popupComponent;
    const oldPopupControlsComponent = this._popupControlsComponent;
    const oldPopupCommentsComponent = this._popupCommentsComponent;

    this._popupControlsComponent = new PopupControlsComponent(this._card);
    this._popupCommentsComponent = new PopupCommentsComponent(this._card.comments);

    if (oldPopupComponent) {
      replace(this._popupControlsComponent, oldPopupControlsComponent);
      replace(this._popupCommentsComponent, oldPopupCommentsComponent);
    } else {
      this._onViewChange();
      this._popupComponent = new PopupComponent(this._card);
      render(siteBodyElement, this._popupComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupControlsContainer(), this._popupControlsComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupCommentsContainer(), this._popupCommentsComponent, RenderPosition.BEFOREEND);
    }

    renderComments(this._popupCommentsComponent.getCommentsList(), this._card.comments, this._onCommentsDataChange);

    // set click event for popup close button and Esc key
    this._popupComponent.setClosePopupClickHandler(this._onCloseButtonClick);

    this._popupControlsComponent.setWatchlistClickHandler(() => {
      this._onDataChange(this._card, Object.assign({}, this._card, {
        isInWatchlist: !this._card.isInWatchlist
      }));
    });

    this._popupControlsComponent.setWatchedClickHandler(() => {
      this._onDataChange(this._card, Object.assign({}, this._card, {
        isWatched: !this._card.isWatched
      }));
    });

    this._popupControlsComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this._card, Object.assign({}, this._card, {
        isFavorite: !this._card.isFavorite
      }));
    });

    this._popupCommentsComponent.setChangeEmojiClickHandler((evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._selectedEmoji = evt.target.value;
      this._popupCommentsComponent.setNewCommentEmojiImg(this._selectedEmoji);
      this._popupCommentsComponent.rerender();
      renderComments(this._popupCommentsComponent.getCommentsList(), this._card.comments, this._onCommentsDataChange);
    });

    document.addEventListener(`keydown`, this._onKeyDown);
  }

  _onCommentsDataChange(id) {
    this._onDataChange(this._card, Object.assign({}, this._card, {
      comments: this._card.comments.filter((comment) => comment.id !== id)
    }));
  }

  // Handler to close popup with click on cross button
  _onCloseButtonClick() {
    remove(this._popupComponent);
  }

  // Handler to close popup with ESC
  _onKeyDown(evt) {
    const isEscapeKey = evt.key === `Esc` || evt.key === `Escape`;
    if (isEscapeKey) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._onKeyDown);
    }
  }

  destroy() {
    if (this._popupComponent) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._onKeyDown);
    }
  }
}
