import CardComponent from "../components/card.js";
import PopupController from "../controllers/popup-controller.js";

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

    this._showPopup = this._showPopup.bind(this);
  }

  _initCardComponent() {
    // Rendering the actual card, if card allready exists than replace it
    const oldCardComponent = this._cardComponent;
    this._cardComponent = new CardComponent(this._card);
    if (oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }
    // Add listeners for poster, name and comments to open popup
    this._cardComponent.setOpenPopupClickHandler(this._showPopup);

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

  render(card) {
    this._card = card;
    if (this._cardComponent) {
      this._cardComponent.update(this._card);
      if (this._popupController) {
        this._popupController.render(this._card);
      }
    } else {
      this._initCardComponent();
    }
  }

  _showPopup() {
    this._onViewChange();
    this._popupController = new PopupController(this._onDataChange, this._onViewChange);
    this._popupController.render(this._card);
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
