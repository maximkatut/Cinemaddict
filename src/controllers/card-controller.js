import PopupInfoComponent from "../components/popup-info.js";
import PopupCommentsComponent from "../components/popup-comments.js";
import PopupBoardComponent from "../components/popup-board.js";
import CardComponent from "../components/card.js";

import {RenderPosition, render, remove} from "../utils/render.js";

export default class CardController {
  constructor(container) {
    this._container = container;
    this._cardComponent = null;
    this._popupInfoComponent = null;
    this._popupCommentsComponent = null;
    this._popupBoardComponent = null;

    this._isPopupOpen = false;
  }

  render(card) {
    // Handler for each filmCard to open popup
    const onOpenPopupClick = () => {
      // Render popup of active filmcard
      // Check if popup allready open than remove it
      if (this._isPopupOpen) { // Doesn't work!!!!!!!
        remove(this._popupBoardComponent);
      }
      // Change the flag when popup gonna be open
      this._isPopupOpen = true;
      // Handler to close popup with ESC
      const onKeyDown = (evt) => {
        const isEscapeKey = evt.key === `Esc` || evt.key === `Escape`;
        if (isEscapeKey) {
          remove(this._popupBoardComponent);
        }
        document.removeEventListener(`keydown`, onKeyDown);
      };
      // Handler to close popup with click on cross button
      const onCloseButtonClick = () => {
        remove(this._popupBoardComponent);
      };
      // Find body element for rendering popup card
      const siteBodyElement = document.querySelector(`body`);
      this._popupBoardComponent = new PopupBoardComponent();
      this._popupInfoComponent = new PopupInfoComponent(card);
      this._popupCommentsComponent = new PopupCommentsComponent(card.comments);

      render(siteBodyElement, this._popupBoardComponent, RenderPosition.BEFOREEND);
      render(this._popupBoardComponent.getBoardInnerElement(), this._popupInfoComponent, RenderPosition.BEFOREEND);
      render(this._popupBoardComponent.getBoardInnerElement(), this._popupCommentsComponent, RenderPosition.BEFOREEND);
      // set click event for popup close button and Esc key
      this._popupInfoComponent.setClosePopupClickHandler(onCloseButtonClick);
      document.addEventListener(`keydown`, onKeyDown);
    };
      // Rendering the actual card
    this._cardComponent = new CardComponent(card);
    render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    // Add listeners for poster, name and comments to open popup
    this._cardComponent.setOpenPopupHandler(onOpenPopupClick);
  }
}
