import CardComponent from "../components/card.js";
import PopupController from "../controllers/popup-controller.js";

import CommentsModel from "../models/comments.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

export default class CardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._card = {};
    this._cardComponent = null;

    this._commentsModel = null;
    this._popupController = null;
  }

  render(card) {
    this._card = card;
    // Rendering the actual card, if card allready exists than replace it
    const oldCardComponent = this._cardComponent;
    this._cardComponent = new CardComponent(this._card);
    if (oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }
    if (this._popupController) {
      this._popupController.render(this._card);
    }
    // Add listeners for poster, name and comments to open popup
    this._cardComponent.setOpenPopupClickHandler(() => {
      // Render popup of active filmcard
      this._commentsModel = new CommentsModel();
      this._commentsModel.setComments(this._card.comments);
      this._popupController = new PopupController(this._commentsModel, this._onDataChange, this._onViewChange);
      this._popupController.render(this._card);
    });

    this._cardComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._card, Object.assign({}, this._card, {
        isInWatchlist: !this._card.isInWatchlist
      }));
    });
    this._cardComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._card, Object.assign({}, this._card, {
        isWatched: !this._card.isWatched
      }));
    });
    this._cardComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._card, Object.assign({}, this._card, {
        isFavorite: !this._card.isFavorite
      }));
    });
  }

  destroy() {
    remove(this._cardComponent);
    this.setDefaultView();
  }

  setDefaultView() {
    if (this._popupController) {
      this._popupController.remove();
    }
  }
}
