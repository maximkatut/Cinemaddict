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
  constructor(api, cardsStore, commentsStore) {
    this._api = api;
    this._cardsStore = cardsStore;
    this._commentsStore = commentsStore;

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
          this._cardsStore.setItems(localCards);
          return cards;
        });
    }

    const storeCards = Object.values(this._cardsStore.getItems());
    return Promise.resolve(Card.parseCards(storeCards));
  }

  updateCard(cardId, card) {
    if (this._isOnline()) {
      return this._api.updateCard(cardId, card)
      .then((newCard) => {
        this._cardsStore.setItem(cardId, newCard.toRAW());
        return newCard;
      });
    }

    this._isSync = false;
    const localCard = Card.clone(Object.assign(card, {cardId}));
    this._cardsStore.setItem(cardId, localCard.toRAW());
    return Promise.resolve(localCard);
  }

  getComments(cardId) {
    if (this._isOnline()) {
      return this._api.getComments(cardId)
        .then((comments) => {
          const localComments = createStoreStructure(comments.map((localComment) => localComment.toRAW()));
          this._commentsStore.setItem(cardId, localComments);
          return comments;
        });
    }

    if (!this._commentsStore.getItems()[cardId]) {
      return Promise.resolve();
    } else {
      const storeComments = Object.values(this._commentsStore.getItems()[cardId]);
      return Promise.resolve(Comment.parseComments(storeComments));
    }
  }

  addComment(comment, cardId) {
    if (this._isOnline()) {
      return this._api.addComment(comment, cardId)
        .then((response) => {
          this._cardsStore.setItem(cardId, response.movie);
          return Comment.parseComments(response.comments);
        })
        .then((comments) => {
          const localComments = createStoreStructure(comments.map((localComment) => localComment.toRAW()));
          this._commentsStore.setItem(cardId, localComments);
          return comments;
        });
    }

    return Promise.reject(new Error(`Can't remove or add comments when offline`));
  }

  deleteComment(commentId) {
    if (this._isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => {
          const storeComments = Object.values(this._commentsStore.getItems());
          const storeCards = Object.values(this._cardsStore.getItems());

          const newStoreComments = storeComments.map((comments) => {
            const newComments = Object.values(comments).filter((comment) => comment.id !== commentId);
            return newComments;
          });

          const newStoreCards = storeCards.map((card) => {
            card.comments = card.comments.filter((comment) => comment !== commentId);
            return card;
          });

          this._commentsStore.setItems(newStoreComments);
          this._cardsStore.setItems(newStoreCards);
        });
    }

    return Promise.reject(new Error(`Can't remove or add comments when offline`));
  }

  sync() {
    if (this._isOnline()) {
      const storeCards = Object.values(this._cardsStore.getItems());

      return this._api.sync(storeCards)
        .then((response) => {
          this._cardsStore.setItems(response.updated);
          this._isSync = true;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
