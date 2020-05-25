import Card from "../models/card.js";
import Comment from "../models/comment.js";

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;

    this._isSync = true;
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  getSyncStatus() {
    return this._isSync;
  }

  getCards() {
    if (this._isOnline()) {
      return this._api.getCards()
        .then((cards) => {
          const localCards = createStoreStructure(cards.map((card) => card.toRAW()));
          this._store.setCards(localCards);
          return cards;
        });
    }
    const storeCards = Object.values(this._store.getCards());

    return Promise.resolve(Card.parseCards(storeCards));
  }

  updateCard(id, card) {
    if (this._isOnline()) {
      return this._api.updateCard(id, card)
      .then((newCard) => {
        this._store.setCard(newCard.id, newCard.toRAW());
        return newCard;
      });
    }

    const localCard = Card.clone(Object.assign(card, {id}));
    this._store.setCard(id, localCard.toRAW());
    return Promise.resolve(localCard);
  }

  getComments(cardId) {
    if (this._isOnline()) {
      return this._api.getComments(cardId)
        .then((comments) => {
          const localComments = comments.map((localComment) => localComment.toRAW());
          this._store.setComments(cardId, localComments);
          return comments;
        });
    }

    const storeComments = Object.values(this._store.getComments(cardId));
    return Promise.resolve(Comment.parseComments(storeComments));
  }

  addComment(comment, cardId) {
    if (this._isOnline()) {
      return this._api.addComment(comment, cardId)
        .then((response) => {
          this._store.setCard(cardId, response.movie);
          return Comment.parseComments(response.comments);
        })
        .then((comments) => {
          const localComments = comments.map((localComment) => localComment.toRAW());
          this._store.setComments(cardId, localComments);
          return comments;
        });
    }

    return Promise.resolve();
  }

  deleteComment(id) {
    if (this._isOnline()) {
      return this._api.deleteComment(id)
        .then(() => {
          this._store.removeComment(id);
        });
    }

    return Promise.resolve();
  }

  sync() {
    if (this._isOnline()) {
      const storeCards = Object.values(this._store.getCards());

      return this._api.sync(storeCards)
        .then((response) => {
          this._store.setCards(response.updated);
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }
}
