import Card from "./models/card.js";
import Comment from "./models/comment.js";

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getCards() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
      .then((response) => response.json())
      .then(Card.parseCards);
  }

  getComments(CardId) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${CardId}`, {headers})
    .then((response) => response.json())
    .then(Comment.parseComments);
  }
}
