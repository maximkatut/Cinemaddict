import CardComponent from "../components/card.js";
import MoreButtonComponent from "../components/more-button.js";
import TopFilmsBoardComponent from "../components/top-films-board.js";
import MostCommentedFilmsBoardComponent from "../components/most-commented-films-board.js";
import PopupBoardComponent from "../components/popup-board.js";
import PopupInfoComponent from "../components/popup-info.js";
import PopupControlsComponent from "../components/popup-controls.js";
import PopupCommentsComponent from "../components/popup-comments.js";
import FilmsCountComponent from "../components/films-count.js";
import NoCardsComponent from "../components/no-cards.js";
import {selectMostCommentedCards, selectTopCards} from "../utils/cardsSelector.js";
import {RenderPosition, render, remove} from "../utils/render.js";

export default class PageController {
  constructor(container) {
    this._container = container;

    this._popupBoardComponent = new PopupBoardComponent();
    this._noCardsComponent = new NoCardsComponent();
    this._moreButtonComponent = new MoreButtonComponent();
    this._topFilmsBoardComponent = new TopFilmsBoardComponent();
    this._mostCommentedFilmsBoardComponent = new MostCommentedFilmsBoardComponent();
  }

  render(cards) {
    const CARDS_COUNT_ON_START = 5;
    const CARDS_COUNT_LOAD_MORE_BUTTON = 5;

    // Rendering card function
    const renderCard = (cardListElement, card) => {
      // Handler for each filmCard to open popup
      const onOpenPopupClick = () => {
        // Render popup of active filmcard
        renderPopup(card);
      };
        // Rendering the actual card
      const cardComponent = new CardComponent(card);
      render(cardListElement, cardComponent, RenderPosition.BEFOREEND);
      // Add listeners for poster, name and comments to open popup
      cardComponent.setOpenPopupOnPosterClickHandler(onOpenPopupClick);
      cardComponent.setOpenPopupOnNameClickHandler(onOpenPopupClick);
      cardComponent.setOpenPopupOnCommentsClickHandler(onOpenPopupClick);
    };
      // Rendering popup function
    const renderPopup = (card) => {
      // Check if popup allready open
      let popupBoardElement = document.querySelector(`.film-details`);
      if (popupBoardElement) {
        remove(this._popupBoardComponent);
      }
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

      popupBoardElement = this._popupBoardComponent.getElement();
      const sitePopupContainer = popupBoardElement.querySelector(`.form-details__top-container`);
      const sitePopupCommentsContainer = popupBoardElement.querySelector(`.film-details__inner`);
      const siteBodyElement = document.querySelector(`body`);

      render(siteBodyElement, this._popupBoardComponent, RenderPosition.BEFOREEND);
      render(sitePopupContainer, new PopupInfoComponent(card), RenderPosition.BEFOREEND);
      render(sitePopupContainer, new PopupControlsComponent(card), RenderPosition.BEFOREEND);
      render(sitePopupCommentsContainer, new PopupCommentsComponent(card.comments), RenderPosition.BEFOREEND);

      this._popupBoardComponent.setClosePopupClickHandler(onCloseButtonClick);
      document.addEventListener(`keydown`, onKeyDown);
    };
      // Rendering board function
    const renderFilmsBoard = (filmsBoardElement) => {
      const siteFilmsListContainerElement = filmsBoardElement.querySelector(`.films-list__container`);
      const siteFilmsListElement = filmsBoardElement.querySelector(`.films-list`);
      const siteFilmsListTitleElement = siteFilmsListElement.querySelector(`.films-list__title`);
      // Check if cards.length === 0 do not render them and change the title
      if (cards.length === 0) {
        siteFilmsListElement.replaceChild(this._noCardsComponent.getElement(), siteFilmsListTitleElement);
        return;
      }
      // Render LoadMoreButton
      render(siteFilmsListElement, this._moreButtonComponent, RenderPosition.BEFOREEND);

      let showingCardsCount = CARDS_COUNT_ON_START;
      cards
        .slice(0, showingCardsCount)
        .forEach((card) => renderCard(siteFilmsListContainerElement, card));

      const removeMoreButton = () => {
        if (showingCardsCount >= cards.length) {
          remove(this._moreButtonComponent);
        }
      };
      // Remove moreButton if at the start has less than 5 cards
      removeMoreButton();
      // Render cards and cards that showing `CARDS_COUNT_LOAD_MORE_BUTTON` cards by click show more button
      this._moreButtonComponent.setClickHandler(() => {
        const showedCardsCount = showingCardsCount;
        showingCardsCount += CARDS_COUNT_LOAD_MORE_BUTTON;
        cards
          .slice(showedCardsCount, showingCardsCount)
          .forEach((card) => renderCard(siteFilmsListContainerElement, card));
        removeMoreButton();
      });
    };
      // Rendering topFilms and board function
    const renderTopFilmsBoard = (topFilmsBoardElement, topRatedCards) => {
      const siteTopFilmsListContainer = topFilmsBoardElement.querySelector(`.films-list__container`);
      topRatedCards.forEach((card) => {
        renderCard(siteTopFilmsListContainer, card);
      });
    };
      // Rendering mostCommentedFilms and board function
    const renderMostCommentedFilmsBoard = (mostCommentedFilmsBoardElement, mostCommentedCards) => {
      const siteMostCommentedFilmsListContainer = mostCommentedFilmsBoardElement.querySelector(`.films-list__container`);
      mostCommentedCards.forEach((card) => {
        renderCard(siteMostCommentedFilmsListContainer, card);
      });
    };

    const topRatedCards = selectTopCards(cards);
    const mostCommentedCards = selectMostCommentedCards(cards);

    // Render main filmsList with cards
    const container = this._container.getElement();
    renderFilmsBoard(container);

    const siteMainElement = document.querySelector(`main`);
    const siteFilmsElement = siteMainElement.querySelector(`.films`);

    // if topRatedCards or mostCommentedCards === 0 => do not render them
    if (topRatedCards.length > 0) {
      render(siteFilmsElement, this._topFilmsBoardComponent, RenderPosition.BEFOREEND);
      renderTopFilmsBoard(this._topFilmsBoardComponent.getElement(), topRatedCards);
    }

    if (mostCommentedCards.length > 0) {
      render(siteFilmsElement, this._mostCommentedFilmsBoardComponent, RenderPosition.BEFOREEND);
      renderMostCommentedFilmsBoard(this._mostCommentedFilmsBoardComponent.getElement(), mostCommentedCards);
    }
    // Render count of all movies
    const siteCountStatisticsContainer = document.querySelector(`.footer__statistics`);
    render(siteCountStatisticsContainer, new FilmsCountComponent(cards.length), RenderPosition.BEFOREEND);
  }
}
