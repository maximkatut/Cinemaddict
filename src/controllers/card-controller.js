import CardComponent from "../components/card.js";
import CardControlsComponent from "../components/card-controls.js";
import PopupController from "../controllers/popup-controller.js";
import CardModel from "../models/card.js";

import {RenderPosition, render, remove} from "../utils/render.js";

export default class CardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._card = {};
    this._cardComponent = null;
    this._cardControlsComponent = null;

    this._popupController = null;

    this._showPopup = this._showPopup.bind(this);
  }

  render(card) {
    const oldCard = this._card;
    this._card = card;
    if (this._cardComponent) {
      if (this._popupController) {
        this._popupController.render(this._card);
      }
      let isCardControlsChanged = false;
      const controlsKeys = [`isFavorite`, `isInWatchlist`, `isWatched`];
      Object.keys(card).forEach((key) => {
        if (oldCard[key] !== this._card[key]) {
          if (controlsKeys.includes(key)) {
            isCardControlsChanged = true;
          }
        }
      });
      if (isCardControlsChanged) {
        this._cardControlsComponent.rerender(this._card);
        return;
      }
      this._cardComponent.rerender(this._card);
      this._cardControlsComponent = new CardControlsComponent(this._card);
      render(this._cardComponent.getElement(), this._cardControlsComponent, RenderPosition.BEFOREEND);
      this._addEventListenersToCardControls();
      return;
    }
    this._cardComponent = new CardComponent(this._card);
    this._cardControlsComponent = new CardControlsComponent(this._card);
    render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    render(this._cardComponent.getElement(), this._cardControlsComponent, RenderPosition.BEFOREEND);

    this._cardComponent.setOpenPopupClickHandler(this._showPopup);
    this._addEventListenersToCardControls();
  }

  _addEventListenersToCardControls() {
    this._cardControlsComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      const newCard = CardModel.clone(this._card);
      newCard.isInWatchlist = !newCard.isInWatchlist;
      newCard.commentsModel = this._card.commentsModel;
      this._onDataChange(this._card, newCard);
    });
    this._cardControlsComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      const newCard = CardModel.clone(this._card);
      newCard.isWatched = !newCard.isWatched;
      newCard.commentsModel = this._card.commentsModel;
      this._onDataChange(this._card, newCard);
    });
    this._cardControlsComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      const newCard = CardModel.clone(this._card);
      newCard.isFavorite = !newCard.isFavorite;
      newCard.commentsModel = this._card.commentsModel;
      this._onDataChange(this._card, newCard);
    });
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
