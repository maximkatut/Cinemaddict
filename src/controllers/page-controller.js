import SortComponent, {SortType} from "../components/sort.js";
import CardComponent from "../components/card.js";
import FilmsListComponent from "../components/films-list.js";
import MoreButtonComponent from "../components/more-button.js";
import PopupBoardComponent from "../components/popup-board.js";
import PopupInfoComponent from "../components/popup-info.js";
import PopupCommentsComponent from "../components/popup-comments.js";
import {selectMostCommentedCards, selectTopCards} from "../utils/cardsSelector.js";
import {RenderPosition, render, remove} from "../utils/render.js";

const CARDS_COUNT_ON_START = 5;
const CARDS_COUNT_LOAD_MORE_BUTTON = 5;

const getSortedCards = (cards, sortType, from, to) => {
  let sortedCards = [];
  const showingCards = cards.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedCards = showingCards.sort((leftCard, rightCard) => rightCard.releaseDate - leftCard.releaseDate);
      break;
    case SortType.RATING:
      sortedCards = showingCards.sort((leftCard, rightCard) => rightCard.rating - leftCard.rating);
      break;
    case SortType.DEFAULT:
      sortedCards = showingCards;
      break;
  }

  return sortedCards.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._isPopupOpen = false;
    this._sortComponent = new SortComponent();
    this._mainFilmsListComponent = new FilmsListComponent(`All movies. Upcoming`, false, false);
    this._topFilmsListComponent = new FilmsListComponent(`Top rated`, true, true);
    this._mostCommentedFilmsListComponent = new FilmsListComponent(`Most commented`, true, true);

    this._popupBoardComponent = new PopupBoardComponent();
    this._moreButtonComponent = new MoreButtonComponent();

    this._showingCardsCount = CARDS_COUNT_ON_START;
  }

  render(cards) {
    // Rendering card function
    const renderCard = (cardsListElement, card) => {
      // Handler for each filmCard to open popup
      const onOpenPopupClick = () => {
        // Render popup of active filmcard
        renderPopup(card);
      };
      // Rendering the actual card
      const cardComponent = new CardComponent(card);
      render(cardsListElement, cardComponent, RenderPosition.BEFOREEND);
      // Add listeners for poster, name and comments to open popup
      cardComponent.setOpenPopupHandler(onOpenPopupClick);
    };
      // Rendering popup function
    const renderPopup = (card) => {
      // Check if popup allready open than remove it
      if (this._isPopupOpen) {
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
      const popupInfoComponent = new PopupInfoComponent(card);

      render(siteBodyElement, this._popupBoardComponent, RenderPosition.BEFOREEND);
      render(this._popupBoardComponent.getBoardInnerElement(), popupInfoComponent, RenderPosition.BEFOREEND);
      render(this._popupBoardComponent.getBoardInnerElement(), new PopupCommentsComponent(card.comments), RenderPosition.BEFOREEND);
      // set click event for popup close button and Esc key
      popupInfoComponent.setClosePopupClickHandler(onCloseButtonClick);
      document.addEventListener(`keydown`, onKeyDown);
    };

    const renderCards = (filmsListElement, cardsArray) => {
      cardsArray.forEach((card) => {
        renderCard(filmsListElement, card);
      });
    };

    const container = this._container.getElement();

    // Check if cards.length === 0 do not render them and change the title
    if (cards.length === 0) {
      this._mainFilmsListComponent.setNewTitle(`There are no movies in our database`, true);
    }
    // render main list of films
    render(container, this._mainFilmsListComponent, RenderPosition.BEFOREEND);

    if (cards.length > 0) {
      // Render LoadMoreButtonComponent
      render(this._mainFilmsListComponent.getElement(), this._moreButtonComponent, RenderPosition.BEFOREEND);
      // render cards
      renderCards(this._mainFilmsListComponent.getListInnerElement(), cards.slice(0, this._showingCardsCount));
      // removeMoreButton function if no more cards hidden
      const removeMoreButton = () => {
        if (this._showingCardsCount >= cards.length) {
          remove(this._moreButtonComponent);
        }
      };
      // Remove moreButton if at the start has less than 5 cards
      removeMoreButton();

      // Render cards and cards that showing `CARDS_COUNT_LOAD_MORE_BUTTON` cards by click show more button
      this._moreButtonComponent.setClickHandler(() => {
        const showedCardsCount = this._showingCardsCount;
        this._showingCardsCount += CARDS_COUNT_LOAD_MORE_BUTTON;
        renderCards(this._mainFilmsListComponent.getListInnerElement(), cards.slice(showedCardsCount, this._showingCardsCount));

        removeMoreButton();
      });
    }
    // set listener for changing sorting type
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      this._mainFilmsListComponent.getListInnerElement().innerHTML = ``;
      const sortedCards = getSortedCards(cards, sortType, 0, this._showingCardsCount);
      renderCards(this._mainFilmsListComponent.getListInnerElement(), sortedCards.slice(0, this._showingCardsCount));
    });
    // if topRatedCards or mostCommentedCards === 0 => do not render them
    // Render top rated films
    const topRatedCards = selectTopCards(cards);
    if (topRatedCards.length > 0) {
      render(container, this._topFilmsListComponent, RenderPosition.BEFOREEND);
      renderCards(this._topFilmsListComponent.getListInnerElement(), topRatedCards);
    }
    // Render most commented films
    const mostCommentedCards = selectMostCommentedCards(cards);
    if (mostCommentedCards.length > 0) {
      render(container, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
      renderCards(this._mostCommentedFilmsListComponent.getListInnerElement(), mostCommentedCards);
    }
    // Render sort menu
    render(container.parentNode, this._sortComponent, RenderPosition.AFTERBEGIN);
  }
}
