import PopupCommentsComponent from "../components/popup-comments.js";
import PopupComponent from "../components/popup.js";
import CardComponent from "../components/card.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

export default class CardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._card = {};
    this._cardComponent = null;
    this._popupInfoComponent = null;
    this._popupCommentsComponent = null;
    this._popupBoardComponent = null;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);

    this._emoji = ``;
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
    // Add listeners for poster, name and comments to open popup
    this._cardComponent.setOpenPopupClickHandler(() => {
      // Render popup of active filmcard
      this._renderPopup();
    });

    this._cardComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._card, Object.assign({}, this._card, {
        isInWatchlist: !this._card.isInWatchlist
      }));
    });
    this._cardComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._card, Object.assign({}, this._card, {
        isWatched: !this._card.isWatched
      }));
    });
    this._cardComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._card, Object.assign({}, this._card, {
        isFavorite: !this._card.isFavorite
      }));
    });
  }

  _renderPopup() {
    this._onViewChange();
    // Find body element for rendering popup card
    const siteBodyElement = document.querySelector(`body`);
    this._popupComponent = new PopupComponent(this._card);
    this._popupCommentsComponent = new PopupCommentsComponent(this._card.comments);

    render(siteBodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    render(this._popupComponent.getPopupCommentsContainer(), this._popupCommentsComponent, RenderPosition.BEFOREEND);
    // set click event for popup close button and Esc key
    this._popupComponent.setClosePopupClickHandler(this._onCloseButtonClick);

    this._popupComponent.setWatchlistClickHandler(() => {
      this._onDataChange(this, this._card, Object.assign({}, this._card, {
        isInWatchlist: !this._card.isInWatchlist
      }));
    });
    this._popupComponent.setWatchedClickHandler(() => {
      this._onDataChange(this, this._card, Object.assign({}, this._card, {
        isWatched: !this._card.isWatched
      }));
    });
    this._popupComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this, this._card, Object.assign({}, this._card, {
        isFavorite: !this._card.isFavorite
      }));
    });
    this._popupCommentsComponent.setChangeEmojiClickHandler((evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._emoji = evt.target.value;
      this._popupCommentsComponent.setNewCommentEmojiImg(this._emoji);
      this._popupCommentsComponent.rerender();
    });

    document.addEventListener(`keydown`, this._onKeyDown);
  }

  setDefaultView() {
    if (this._popupComponent) {
      remove(this._popupComponent);
    }
  }

  // Handler to close popup with ESC
  _onKeyDown(evt) {
    const isEscapeKey = evt.key === `Esc` || evt.key === `Escape`;
    if (isEscapeKey) {
      remove(this._popupComponent);
    }
    document.removeEventListener(`keydown`, this._onKeyDown);
  }

  // Handler to close popup with click on cross button
  _onCloseButtonClick() {
    remove(this._popupComponent);
  }
}
