import FilmsListComponent from "../components/films-list.js";
import CardController from "./card-controller.js";

import {selectMostCommentedCards} from "../utils/cards-selector.js";
import {RenderPosition, render, replace} from "../utils/render.js";

const renderCards = (filmsListElement, cards, onDataChange, onViewChange, api) => {
  return cards.map((card) => {
    const cardController = new CardController(filmsListElement, onDataChange, onViewChange, api);
    cardController.render(card);
    return cardController;
  });
};

export default class MostCommentedCardsController {
  constructor(container, cardsModel, onDataChange, onViewChange, api) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._showedCardControllers = [];
    this._mostCommentedFilmsListComponent = null;

    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);
    this._cardsModel.setCommentsDataChangeHandler(this._onCommentsDataChange);
  }

  render() {
    const cards = this._cardsModel.getCards();
    const oldComponent = this._mostCommentedFilmsListComponent;
    this._mostCommentedFilmsListComponent = new FilmsListComponent(`Most commented`, true, true);

    const mostCommentedCards = selectMostCommentedCards(cards);
    if (mostCommentedCards.length > 0) {
      if (oldComponent) {
        replace(this._mostCommentedFilmsListComponent, oldComponent);
      } else {
        render(this._container, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
      }
      const newCards = renderCards(this._mostCommentedFilmsListComponent.getListInnerElement(), mostCommentedCards, this._onDataChange, this._onViewChange, this._api);
      this._showedCardControllers = this._showedCardControllers.concat(newCards);
    }
  }

  _onCommentsDataChange() {
    this.render();
  }

  getShowedCardControllers() {
    return this._showedCardControllers;
  }
}
