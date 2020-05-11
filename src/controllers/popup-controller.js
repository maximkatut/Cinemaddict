import PopupComponent from "../components/popup.js";
import PopupControlsComponent from "../components/popup-controls.js";
import PopupCommentsListComponent from "../components/popup-comments-list.js";
import PopupNewCommentComponent, {EmojiNames} from "../components/popup-new-comment.js";
import CommentController from "../controllers/comment-controller.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

const renderComments = (container, comments, onCommentsDataChange) => {
  return comments.forEach((comment) => {
    const commentController = new CommentController(container, onCommentsDataChange);
    commentController.render(comment);
  });
};

export default class PopupController {
  constructor(commentsModel, onDataChange, onViewChange) {
    this._card = {};
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._commentsModel = commentsModel;

    this._popupComponent = null;
    this._popupControlsComponent = null;
    this._popupCommentsListComponent = null;
    this._popupNewCommentComponent = null;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);

    this._selectedEmoji = ``;
    this._newCommentText = ``;
  }

  render(card) {
    this._card = card;
    // Find body element for rendering popup card
    const siteBodyElement = document.querySelector(`body`);
    const oldPopupComponent = this._popupComponent;
    const oldPopupControlsComponent = this._popupControlsComponent;
    const oldPopupCommentsComponent = this._popupCommentsListComponent;

    this._popupControlsComponent = new PopupControlsComponent(this._card);
    this._popupCommentsListComponent = new PopupCommentsListComponent(this._card.comments);
    this._popupNewCommentComponent = new PopupNewCommentComponent();

    if (oldPopupComponent) {
      replace(this._popupControlsComponent, oldPopupControlsComponent);
      replace(this._popupCommentsListComponent, oldPopupCommentsComponent);
      render(this._popupCommentsListComponent.getElement(), this._popupNewCommentComponent, RenderPosition.BEFOREEND);
    } else {
      this._onViewChange();
      this._popupComponent = new PopupComponent(this._card);
      render(siteBodyElement, this._popupComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupControlsContainer(), this._popupControlsComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupCommentsContainer(), this._popupCommentsListComponent, RenderPosition.BEFOREEND);
      render(this._popupCommentsListComponent.getElement(), this._popupNewCommentComponent, RenderPosition.BEFOREEND);
    }

    renderComments(this._popupCommentsListComponent.getCommentsList(), this._card.comments, this._onCommentsDataChange);

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

    this._popupNewCommentComponent.setNewCommentInputChangeHandler((evt) => {
      if (evt.target.tagName !== `TEXTAREA`) {
        return;
      }
      this._newCommentText = evt.target.value;
      this._popupNewCommentComponent.setNewCommentText(this._newCommentText);
    });

    this._popupNewCommentComponent.setSubmitHandler(this._onCommentsDataChange);

    this._popupNewCommentComponent.setChangeEmojiClickHandler((evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._selectedEmoji = evt.target.value;
      this._popupNewCommentComponent.setNewCommentEmojiImg(this._selectedEmoji);
      this._popupNewCommentComponent.rerender();
    });

    document.addEventListener(`keydown`, this._onKeyDown);
    this._selectedEmoji = EmojiNames.SMILE;
  }

  _onCommentsDataChange(id, newComment) {
    if (newComment === null) {
      const isSuccess = this._commentsModel.deleteComment(id);
      if (isSuccess) {
        this._onDataChange(this._card, Object.assign({}, this._card, {
          comments: this._commentsModel.getComments()
        }));
      }
    } else if (id === null) {
      this._commentsModel.addComment(newComment);
      this._onDataChange(this._card, Object.assign({}, this._card, {
        comments: this._commentsModel.getComments()
      }));
    }
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

  remove() {
    if (this._popupComponent) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._onKeyDown);
    }
  }
}
