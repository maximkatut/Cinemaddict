export default class Store {
  constructor(storage, key) {
    this._storage = storage;
    this._storeKey = key;
  }

  getCards() {
    try {
      return JSON.parse(this._storage.getCard(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setCard(key, value) {
    const store = this.getCards();

    this._storage.setCard(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  // getComments() {
  //   try {
  //     return JSON.parse(this._storage.getItem(this._storeKey)) || {};
  //   } catch (err) {
  //     return {};
  //   }
  // }

  // setComment() {

  // }

  // removeComment(key) {

  // }
}
