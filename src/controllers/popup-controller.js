import PopupComponent from "../components/popup.js";
import PopupControlsComponent from "../components/popup-controls.js";
import PopupCommentsListComponent from "../components/popup-comments-list.js";
import PopupCommentsListComponentCount from "../components/popup-comments-list-count.js";
import PopupNewCommentComponent from "../components/popup-new-comment.js";
import CommentController from "../controllers/comment-controller.js";
import CardModel from "../models/card.js";
import CommentsModel from "../models/comments.js";
import CommentModel from "../models/comment.js";
import {checkControlsOnChange} from "../utils/controls.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

const renderComments = (container, comments, onCommentsDataChange) => {
  return comments.map((comment) => {
    const commentController = new CommentController(container, onCommentsDataChange);
    commentController.render(comment);
    return commentController;
  });
};

const parseNewCommentData = (newComment) => {
  return new CommentModel({
    "id": newComment.id,
    "author": newComment.author,
    "comment": newComment.content,
    "date": newComment.date,
    "emotion": newComment.emoji
  });
};

export default class PopupController {
  constructor(onDataChange, onViewChange, api) {
    this._card = {};
    this._comments = [];
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._commentsModel = new CommentsModel();

    this._popupComponent = null;
    this._popupControlsComponent = null;
    this._popupCommentsListComponent = null;
    this._popupCommentsListComponentCount = null;
    this._popupNewCommentComponent = null;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);

    this._showedCommentControllers = null;
    this._selectedEmoji = ``;
    this._newCommentText = ``;
  }

  render(card) {
    const oldCard = this._card;
    this._card = card;

    const siteBodyElement = document.querySelector(`body`);
    const oldPopupComponent = this._popupComponent;


    if (oldPopupComponent) {
      if (checkControlsOnChange(oldCard, this._card)) {
        this._popupControlsComponent.rerender(this._card);
        return;
      } else {
        const oldPopupNewCommentComponent = this._popupNewCommentComponent;
        this._popupNewCommentComponent = new PopupNewCommentComponent();
        replace(this._popupNewCommentComponent, oldPopupNewCommentComponent);
      }
    } else {
      this._onViewChange();
      this._popupComponent = new PopupComponent(this._card);
      this._popupControlsComponent = new PopupControlsComponent(this._card);
      this._popupCommentsListComponent = new PopupCommentsListComponent();
      this._popupCommentsListComponentCount = new PopupCommentsListComponentCount(this._card.comments);
      this._popupNewCommentComponent = new PopupNewCommentComponent();

      render(siteBodyElement, this._popupComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupControlsContainer(), this._popupControlsComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupCommentsContainer(), this._popupCommentsListComponent, RenderPosition.BEFOREEND);
      render(this._popupCommentsListComponent.getElement(), this._popupCommentsListComponentCount, RenderPosition.AFTERBEGIN);
      render(this._popupCommentsListComponent.getElement(), this._popupNewCommentComponent, RenderPosition.BEFOREEND);

      this._popupCommentsListComponent.preloadData();

      this._api.getComments(this._card.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
      })
      .then(() => {
        this._popupCommentsListComponent.removePreload();
        this._comments = this._commentsModel.getComments();
        this._showedCommentControllers = renderComments(this._popupCommentsListComponent.getCommentsList(), this._comments, this._onCommentsDataChange);
      })
      .catch(() => {
        this._popupCommentsListComponent.setNoDataTitle();
      });
    }

    // set click event for popup close button and Esc key
    this._popupComponent.setClosePopupClickHandler(this._onCloseButtonClick);

    this._popupControlsComponent.setWatchlistClickHandler(() => {
      this._changePopupControlsData(`isInWatchlist`);
    });

    this._popupControlsComponent.setWatchedClickHandler(() => {
      this._changePopupControlsData(`isWatched`);
    });

    this._popupControlsComponent.setFavoriteClickHandler(() => {
      this._changePopupControlsData(`isFavorite`);
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
  }

  _changePopupControlsData(changedData) {
    const newCard = CardModel.clone(this._card);
    newCard[changedData] = !newCard[changedData];
    this._popupControlsComponent.setControlButtonsDisabledStatus(true);
    this._onDataChange(this._card, newCard);
    this._popupControlsComponent.setControlButtonsDisabledStatus(false);
  }

  _onCommentsDataChange(id, newComment) {
    if (newComment === null) {
      // Delete a comment
      const commentController = this._showedCommentControllers.find((it) => it._comment.id === id);
      commentController.setDeleteButtonData({
        buttonName: `Deleting...`,
        isDisabled: true,
        isShake: false
      });
      this._api.deleteComment(id)
        .then(() => {
          const isSuccess = this._commentsModel.deleteComment(id);
          if (isSuccess) {
            commentController.destroy();
            const newCard = CardModel.clone(this._card);
            newCard.comments = this._card.comments.filter((comment) => comment !== id);
            this._popupCommentsListComponentCount.rerender(this._commentsModel.getComments());
            this._onDataChange(this._card, newCard);
            this._showedCommentControllers = this._showedCommentControllers.filter((it) => commentController !== it);
          }
        })
        .catch(() => {
          commentController.setDeleteButtonData({
            buttonName: `Delete`,
            isDisabled: false,
            isShake: true
          });
        });

    } else if (id === null) {
      // Add new comment
      this._popupNewCommentComponent.setInputStatus(true);
      const newCommentParsed = parseNewCommentData(newComment);
      this._api.addComment(newCommentParsed, this._card.id)
        .then((comments) => {
          this._commentsModel.setComments(comments);
          const newData = this._commentsModel.getComments()[this._commentsModel.getComments().length - 1];
          const newCard = CardModel.clone(this._card);
          newCard.comments = this._card.comments.concat(newData.id);
          this._popupCommentsListComponentCount.rerender(this._commentsModel.getComments());
          this._onDataChange(this._card, newCard);
          const commentController = new CommentController(this._popupCommentsListComponent.getCommentsList(), this._onCommentsDataChange);
          commentController.render(newData);
          this._showedCommentControllers.push(commentController);
        })
        .catch(() => {
          this._popupNewCommentComponent.setInputStatus(false);
          this._popupComponent.shake();
        });
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
