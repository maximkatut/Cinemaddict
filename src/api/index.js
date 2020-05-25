import Card from "../models/card.js";
import Comment from "../models/comment.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization, endPoint) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getCards() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Card.parseCards);
  }

  updateCard(id, card) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(card.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Card.parseCard);
  }

  getComments(cardId) {
    return this._load({url: `comments/${cardId}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  addComment(comment, cardId) {
    return this._load({
      url: `comments/${cardId}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  deleteComment(id) {
    return this._load({
      url: `comments/${id}`,
      method: Method.DELETE,
    });
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
