import SortComponent, {SortType} from "../components/sort.js";
import FilmsListComponent from "../components/films-list.js";
import MoreButtonComponent from "../components/more-button.js";
import CardController from './card-controller.js';

import {selectMostCommentedCards, selectTopCards} from "../utils/cardsSelector.js";
import {RenderPosition, render, remove} from "../utils/render.js";

const CARDS_COUNT_ON_START = 5;
const CARDS_COUNT_LOAD_MORE_BUTTON = 5;

const renderCards = (filmsListElement, cards, onDataChange, onViewChange) => {
  cards.forEach((card) => {
    new CardController(filmsListElement, onDataChange, onViewChange).render(card);
  });
};

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

    this._cards = [];

    this._sortComponent = new SortComponent();
    this._mainFilmsListComponent = new FilmsListComponent(`All movies. Upcoming`, false, false);
    this._topFilmsListComponent = new FilmsListComponent(`Top rated`, true, true);
    this._mostCommentedFilmsListComponent = new FilmsListComponent(`Most commented`, true, true);
    this._moreButtonComponent = new MoreButtonComponent();

    this._showingCardsCount = CARDS_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cards) {
    const container = this._container.getElement();
    this._cards = cards;

    // Check if cards.length === 0 do not render them and change the title
    if (this._cards.length === 0) {
      this._mainFilmsListComponent.setNewTitle(`There are no movies in our database`, true);
    }
    // render main list of films
    render(container, this._mainFilmsListComponent, RenderPosition.BEFOREEND);

    if (this._cards.length > 0) {
      this._renderLoadMoreButton();
      // render cards
      renderCards(this._mainFilmsListComponent.getListInnerElement(), this._cards.slice(0, this._showingCardsCount), this._onDataChange, this._onViewChange);
    }
    // Render sort menu
    render(container.parentNode, this._sortComponent, RenderPosition.AFTERBEGIN);

    // if topRatedCards or mostCommentedCards === 0 => do not render them
    // Render top rated films
    const topRatedCards = selectTopCards(this._cards);
    if (topRatedCards.length > 0) {
      render(container, this._topFilmsListComponent, RenderPosition.BEFOREEND);
      renderCards(this._topFilmsListComponent.getListInnerElement(), topRatedCards, this._onDataChange, this._onViewChange);
    }
    // Render most commented films
    const mostCommentedCards = selectMostCommentedCards(this._cards);
    if (mostCommentedCards.length > 0) {
      render(container, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
      renderCards(this._mostCommentedFilmsListComponent.getListInnerElement(), mostCommentedCards, this._onDataChange, this._onViewChange);
    }
  }

  _renderLoadMoreButton() {
    // Render LoadMoreButtonComponent
    render(this._mainFilmsListComponent.getElement(), this._moreButtonComponent, RenderPosition.BEFOREEND);
    // removeMoreButton function if no more cards hidden
    const removeMoreButton = () => {
      if (this._showingCardsCount >= this._cards.length) {
        remove(this._moreButtonComponent);
      }
    };
    // Remove moreButton if at the start has less than 5 cards
    removeMoreButton();
    // Render cards and cards that showing `CARDS_COUNT_LOAD_MORE_BUTTON` cards by click show more button
    this._moreButtonComponent.setClickHandler(() => {
      const showedCardsCount = this._showingCardsCount;
      this._showingCardsCount += CARDS_COUNT_LOAD_MORE_BUTTON;
      const sortedCards = getSortedCards(this._cards, this._sortComponent.getSortType(), showedCardsCount, this._showingCardsCount);
      renderCards(this._mainFilmsListComponent.getListInnerElement(), sortedCards, this._onDataChange, this._onViewChange);
      removeMoreButton();
    });
  }

  _onSortTypeChange(sortType) {
    // set listener for changing sorting type
    this._mainFilmsListComponent.getListInnerElement().innerHTML = ``;
    const sortedCards = getSortedCards(this._cards, sortType, 0, this._showingCardsCount);
    renderCards(this._mainFilmsListComponent.getListInnerElement(), sortedCards.slice(0, this._showingCardsCount), this._onDataChange, this._onViewChange);
    remove(this._moreButtonComponent);
    this._renderLoadMoreButton();
  }

  _onDataChange(cardController, oldCard, newCard) {
    const index = this._cards.findIndex((it) => it === oldCard);
    if (index === -1) {
      return;
    }
    this._cards = [].concat(this._cards.slice(0, index), newCard, this._cards.slice(index + 1));
    // ??????????
    cardController.render(this._cards[index]);
  }

  _onViewChange() {
    new CardController().setDefaultView();
    // как обратиться ко всем кард-контроллерам
  }
}
