import PopupInfoComponent from "../components/popup-info.js";
import PopupCommentsComponent from "../components/popup-comments.js";
import PopupBoardComponent from "../components/popup-board.js";
import CardComponent from "../components/card.js";

import {RenderPosition, render, remove} from "../utils/render.js";

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
    this._onViewChange();
    // Handler for each filmCard to open popup
    const onOpenPopupClick = () => {
      // Render popup of active filmcard
      this._renderPopup();
    };
      // Rendering the actual card
    this._cardComponent = new CardComponent(this._card);
    render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    // Add listeners for poster, name and comments to open popup
    this._cardComponent.setOpenPopupClickHandler(onOpenPopupClick);
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
    // Check if popup allready open than remove it
    if (this._isPopupOpen) { // Doesn't work!!!!!!!
      remove(this._popupBoardComponent);
    }
    // Change the flag when popup gonna be open
    this._isPopupOpen = true;
    // Find body element for rendering popup card
    const siteBodyElement = document.querySelector(`body`);
    this._popupBoardComponent = new PopupBoardComponent();
    this._popupInfoComponent = new PopupInfoComponent(this._card);
    this._popupCommentsComponent = new PopupCommentsComponent(this._card.comments);

    render(siteBodyElement, this._popupBoardComponent, RenderPosition.BEFOREEND);
    render(this._popupBoardComponent.getBoardInnerElement(), this._popupInfoComponent, RenderPosition.BEFOREEND);
    render(this._popupBoardComponent.getBoardInnerElement(), this._popupCommentsComponent, RenderPosition.BEFOREEND);
    // set click event for popup close button and Esc key
    this._popupInfoComponent.setClosePopupClickHandler(this._onCloseButtonClick);
    this._popupInfoComponent.setWatchlistClickHandler(() => {
      this._onDataChange(this, this._card, Object.assign({}, this._card, {
        isInWatchlist: !this._card.isInWatchlist
      }));
    });
    this._popupInfoComponent.setWatchedClickHandler(() => {
      this._onDataChange(this, this._card, Object.assign({}, this._card, {
        isWatched: !this._card.isWatched
      }));
    });
    this._popupInfoComponent.setFavoriteClickHandler(() => {
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
    if (this._popupBoardComponent) {
      remove(this._popupBoardComponent);
    }
  }

  // Handler to close popup with ESC
  _onKeyDown(evt) {
    const isEscapeKey = evt.key === `Esc` || evt.key === `Escape`;
    if (isEscapeKey) {
      remove(this._popupBoardComponent);
    }
    document.removeEventListener(`keydown`, this._onKeyDown);
  }

  // Handler to close popup with click on cross button
  _onCloseButtonClick() {
    remove(this._popupBoardComponent);
  }
}
