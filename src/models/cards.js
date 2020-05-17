import {getCardsByFilter} from "../utils/filter.js";
import CommentsModel from "./comments.js";

export default class Cards {
  constructor(api) {
    this._api = api;
    this._cards = [];
    this._filterType = ``;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getCards() {
    return getCardsByFilter(this._filterType, this._cards);
  }

  getCardsAll() {
    return this._cards;
  }

  setCards(cards) {
    this._cards = Array.from(cards);
    this._cards.forEach((card) => {
      const commentsModel = new CommentsModel();
      this._api.getComments(card.id)
        .then((comments) => {
          commentsModel.setComments(comments);
        });
      card.commentsModel = commentsModel;
    });
    this._callHandlers(this._dataChangeHandlers);
  }

  updateCard(id, card) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._filterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }
}
