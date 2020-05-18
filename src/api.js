import Card from "./models/card.js";
import Comment from "./models/comment.js";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization, url) {
    this._authorization = authorization;
    this._url = url;
  }

  getCards() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._url}/movies`, {headers})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Card.parseCards);
  }

  getComments(CardId) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._url}/comments/${CardId}`, {headers})
    .then(checkStatus)
    .then((response) => response.json())
    .then(Comment.parseComments);
  }

  updateCard(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`${this._url}/movies/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data.toRAW()),
      headers,
    }).then(checkStatus)
      .then((response) => response.json())
      .then(Card.parseCard);
  }
}
