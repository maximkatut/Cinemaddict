export default class Store {
  constructor(storage, key) {
    this._storage = storage;
    this._storeKey = key;
    this._storeCommentsKey = `${key}-comments`;
  }

  getCards() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setCards(cards) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(cards)
    );
  }

  setCard(cardId, card) {
    const store = this.getCards();
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [cardId]: card
            })
        )
    );
  }

  getComments(cardId) {
    try {
      const comments = JSON.parse(this._storage.getItem(this._storeCommentsKey));
      return comments[cardId] || {};
    } catch (err) {
      return {};
    }
  }

  getCommentsAll() {
    try {
      return JSON.parse(this._storage.getItem(this._storeCommentsKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setComments(cardId, comments) {
    const store = this.getCommentsAll();
    this._storage.setItem(
        this._storeCommentsKey,
        JSON.stringify(
            Object.assign({}, store, {
              [cardId]: comments
            })
        )
    );
  }

  removeComment(commentId) {
    const storeComments = this.getCommentsAll();
    const newStoreComments = Object.values(storeComments).map((comments) => {
      const newComments = comments.filter((comment) => comment.id !== commentId);
      return newComments;
    });
    this._storage.setItem(
        this._storeCommentsKey,
        JSON.stringify(Object.assign({}, newStoreComments))
    );

    const storeCards = this.getCards();
    const newStoreCards = Object.values(storeCards).map((card) => {
      card.comments = card.comments.filter((comment) => comment !== commentId);
      return card;
    });
    this.setCards(newStoreCards);
  }
}
