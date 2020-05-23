import Card from "../models/card.js";
import Comment from "../models/comment.js";

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getCards() {
    if (isOnline) {
      return this._api.getCards()
        .then((cards) => {
          cards.forEach((card) => this._store.setCard(card.id, card.toRAW()));

          return cards;
        });
    }
    const storeCards = Object.values(this._store.getCards());

    return Promise.resolve(Card.parseCards(storeCards));
  }

  updateCard(id, card) {
    if (isOnline) {
      return this._api.updateCard(id, card)
      .then((newCard) => {
        this._store.setItem(newCard.id, newCard.toRAW());

        return newCard;
      });
    }
    const localCard = Card.clone(Object.assign(card, {id}));

    this._store.setItem(id, localCard.toRAW());

    return Promise.resolve(localCard);
  }

  getComments(cardId) {
    if (isOnline) {
      return this._api.getComments(cardId)
        .then((comments) => {
          comments.forEach((comment) => this._store.setComment(comment.id, comment.toRAW()));
          return comments;
        });
    }
    const storeComments = Object.values(this._store.getComments());

    return Promise.resolve(Comment.parseComments(storeComments));
  }

  addComment(comment, cardId) {
    if (isOnline) {
      return this._api.addComment(comment, cardId);
    }
    return Promise.reject(`offline logic is not implemented`);
  }

  deleteComment(id) {
    if (isOnline) {
      return this._api.deleteComment(id);
    }
    return Promise.reject(`offline logic is not implemented`);
  }
}
