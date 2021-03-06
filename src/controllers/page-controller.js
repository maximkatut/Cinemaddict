import SortComponent, {SortType} from "../components/sort.js";
import FilmsListComponent from "../components/films-list.js";
import MoreButtonComponent from "../components/more-button.js";
import CardController from "./card-controller.js";
import MostCommentedCardsController from "./most-commented-cards-controller.js";

import {selectTopCards} from "../utils/cards-selector.js";
import {RenderPosition, render, remove} from "../utils/render.js";

const CARDS_COUNT_ON_START = 5;
const CARDS_COUNT_LOAD_MORE_BUTTON = 5;

const renderCards = (filmsListElement, cards, onDataChange, onViewChange, api) => {
  return cards.map((card) => {
    const cardController = new CardController(filmsListElement, onDataChange, onViewChange, api);
    cardController.render(card);
    return cardController;
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
  constructor(container, cardsModel, api) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._api = api;

    this._showedCardControllers = [];

    this._sortComponent = new SortComponent();
    this._mainFilmsListComponent = new FilmsListComponent(`All movies. Upcoming`, false, false);
    this._topFilmsListComponent = new FilmsListComponent(`Top rated`, true, true);
    this._moreButtonComponent = new MoreButtonComponent();

    this._showingCardsCount = CARDS_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._cardsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
    this._sortComponent.setSortTypeToDefault();
  }

  show() {
    this._container.show();
  }

  render() {
    const container = this._container.getElement();
    const cards = this._cardsModel.getCards();
    this._renderLoadMoreButton();

    // Check if cards.length === 0 do not render them and change the title
    if (cards.length === 0) {
      this._mainFilmsListComponent.setNewTitle(`There are no movies in our database`, true);
      render(container, this._mainFilmsListComponent, RenderPosition.BEFOREEND);
      return;
    }
    // render main list of films
    render(container, this._mainFilmsListComponent, RenderPosition.BEFOREEND);

    if (cards.length > 0) {
      // render cards
      const newCards = renderCards(this._mainFilmsListComponent.getListInnerElement(), cards.slice(0, this._showingCardsCount), this._onDataChange, this._onViewChange, this._api);
      this._showedCardControllers = this._showedCardControllers.concat(newCards);
    }
    // Render sort menu
    render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);

    // if topRatedCards or mostCommentedCards === 0 => do not render them
    // Render top rated films
    const topRatedCards = selectTopCards(cards);
    if (topRatedCards.length > 0) {
      render(container, this._topFilmsListComponent, RenderPosition.BEFOREEND);
      const newCards = renderCards(this._topFilmsListComponent.getListInnerElement(), topRatedCards, this._onDataChange, this._onViewChange, this._api);
      this._showedCardControllers = this._showedCardControllers.concat(newCards);
    }
    // Render most commented films
    this._mostCommentedCardsController = new MostCommentedCardsController(container, this._cardsModel, this._onDataChange, this._onViewChange, this._api);
    this._mostCommentedCardsController.render();
    const showedMostCommentedCardControllers = this._mostCommentedCardsController.getShowedCardControllers();
    this._showedCardControllers = this._showedCardControllers.concat(showedMostCommentedCardControllers);
  }

  _removeCards() {
    this._showedCardControllers.forEach((cardController) => cardController.destroy());
    this._showedCardControllers = [];
  }

  _updateCards() {
    this._removeCards();
    this._container.getElement().innerHTML = ``;
    this._showingCardsCount = CARDS_COUNT_ON_START;
    this._sortComponent.setSortTypeToDefault();
    this.render();
  }

  _renderLoadMoreButton() {
    remove(this._moreButtonComponent);
    const cards = this._cardsModel.getCards();
    // Remove moreButton if at the start has less than 5 cards
    if (this._showingCardsCount >= cards.length) {
      return;
    }
    // Render LoadMoreButtonComponent
    render(this._mainFilmsListComponent.getElement(), this._moreButtonComponent, RenderPosition.BEFOREEND);
    // Render cards and cards that showing `CARDS_COUNT_LOAD_MORE_BUTTON` cards by click show more button
    this._moreButtonComponent.setClickHandler(() => {
      const showedCardsCount = this._showingCardsCount;
      this._showingCardsCount += CARDS_COUNT_LOAD_MORE_BUTTON;
      const sortedCards = getSortedCards(cards, this._sortComponent.getSortType(), showedCardsCount, this._showingCardsCount);
      const newCards = renderCards(this._mainFilmsListComponent.getListInnerElement(), sortedCards, this._onDataChange, this._onViewChange, this._api);
      this._showedCardControllers = this._showedCardControllers.concat(newCards);
      // removeMoreButton function if no more cards hidden
      if (this._showingCardsCount >= cards.length) {
        remove(this._moreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    const cards = this._cardsModel.getCards();
    // set listener for changing sorting type
    this._mainFilmsListComponent.getListInnerElement().innerHTML = ``;
    const sortedCards = getSortedCards(cards, sortType, 0, this._showingCardsCount);
    const newCards = renderCards(this._mainFilmsListComponent.getListInnerElement(), sortedCards.slice(0, this._showingCardsCount), this._onDataChange, this._onViewChange, this._api);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._renderLoadMoreButton();
  }

  _onDataChange(oldCard, newCard, onlyLocalUpdate = false) {
    const updateModel = () => {
      const isSuccess = this._cardsModel.updateCard(oldCard.id, newCard);
      if (isSuccess) {
        this._showedCardControllers.forEach((controller) => {
          if (controller.getCard() === oldCard) {
            controller.render(newCard);
          }
        });
      }
    };

    if (onlyLocalUpdate) {
      updateModel();
      return Promise.resolve();
    }
    return this._api.updateCard(oldCard.id, newCard)
      .then(() => {
        updateModel();
      });
  }

  _onViewChange() {
    this._showedCardControllers.forEach((controller) => controller.setDefaultView());
  }

  _onFilterChange() {
    this._updateCards();
  }

  setLoadingTitle() {
    this._mainFilmsListComponent.setNewTitle(`Loading...`, true);
  }
}
