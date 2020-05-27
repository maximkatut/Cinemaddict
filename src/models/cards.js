import {getCardsByFilter} from "../utils/filter.js";
export default class Cards {
  constructor(api) {
    this._api = api;
    this._cards = [];
    this._filterType = ``;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._commentsChangeHandlers = [];
  }

  getCards() {
    return getCardsByFilter(this._filterType, this._cards);
  }

  getCardsAll() {
    return this._cards;
  }

  setCards(cards) {
    this._cards = Array.from(cards);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateCard(id, newCard) {
    const index = this._cards.findIndex((oldCard) => oldCard.id === id);

    if (index === -1) {
      return false;
    }

    let isCommentsChanged = false;

    if (this._cards[index].comments.length !== newCard.comments.length) {
      isCommentsChanged = true;
    }

    this._cards = [].concat(this._cards.slice(0, index), newCard, this._cards.slice(index + 1));

    if (isCommentsChanged) {
      this._callHandlers(this._commentsChangeHandlers);
    }

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

  setCommentsDataChangeHandler(handler) {
    this._commentsChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._filterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }
}
