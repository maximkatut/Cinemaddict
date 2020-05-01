export default class Cards {
  constructor() {
    this._cards = [];

    this._dataChangeHandlers = [];
  }

  getCards() {
    return this._cards;
  }

  setCards(cards) {
    this._cards = Array.from(cards);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateCard(id, card) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
