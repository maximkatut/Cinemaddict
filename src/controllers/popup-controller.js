import PopupComponent from "../components/popup.js";
import PopupControlsComponent from "../components/popup-controls.js";
import PopupCommentsListComponent from "../components/popup-comments-list.js";
import PopupNewCommentComponent from "../components/popup-new-comment.js";
import CommentController from "../controllers/comment-controller.js";
import CardModel from "../models/card.js";
import CommentsModel from "../models/comments.js";


import {RenderPosition, render, remove, replace} from "../utils/render.js";

const renderComments = (container, comments, onCommentsDataChange) => {
  return comments.forEach((comment) => {
    const commentController = new CommentController(container, onCommentsDataChange);
    commentController.render(comment);
  });
};

export default class PopupController {
  constructor(onDataChange, onViewChange, api) {
    this._card = {};
    this._comments = [];
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._commentsModel = null;

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
    this._commentsModel = new CommentsModel();
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

    this._api.getComments(this._card.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
      })
      .then(() => {
        this._popupCommentsListComponent.removePreloadingPlaceholder();
        this._popupNewCommentComponent.enableInput();
        this._comments = this._commentsModel.getComments();
        renderComments(this._popupCommentsListComponent.getCommentsList(), this._comments, this._onCommentsDataChange);
      })
      .catch(() => {
        this._popupCommentsListComponent.setNoDataTitle();
      });

    // set click event for popup close button and Esc key
    this._popupComponent.setClosePopupClickHandler(this._onCloseButtonClick);

    this._popupControlsComponent.setWatchlistClickHandler(() => {
      const newCard = CardModel.clone(this._card);
      newCard.isInWatchlist = !newCard.isInWatchlist;
      this._popupControlsComponent.disableControlButtons();
      this._onDataChange(this._card, newCard);
    });

    this._popupControlsComponent.setWatchedClickHandler(() => {
      const newCard = CardModel.clone(this._card);
      newCard.isWatched = !newCard.isWatched;
      this._popupControlsComponent.disableControlButtons();
      this._onDataChange(this._card, newCard);
    });

    this._popupControlsComponent.setFavoriteClickHandler(() => {
      const newCard = CardModel.clone(this._card);
      newCard.isFavorite = !newCard.isFavorite;
      this._popupControlsComponent.disableControlButtons();
      this._onDataChange(this._card, newCard);
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


  _onCommentsDataChange(id, newComment) {
    if (newComment === null) {
      const isSuccess = this._commentsModel.deleteComment(id);
      if (isSuccess) {
        this._onDataChange(this._card, Object.assign({}, this._card, {
          comments: this._card.comments.filter((comment) => comment !== id)
        }));
      }
    } else if (id === null) {
      this._api.createComment(newComment, this._card.id)
        .then(() => {
          this._commentsModel.addComment(newComment);
          this._onDataChange(this._card, Object.assign({}, this._card, {
            comments: this._card.comments.concat(newComment.id)
          }));
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
