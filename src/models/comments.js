import moment from "moment";
export default class Comments {
  constructor() {
    this._comments = [];
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = Array.from(comments.sort((leftComment, rightComment) => {
      return moment(leftComment.date) - moment(rightComment.date);
    }));
  }

  deleteComment(id) {
    const index = this._comments.findIndex((comment) => comment.id === id);
    if (index === -1) {
      return false;
    }
    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));
    return true;
  }

  addComment(comment) {
    this._comments = [].concat(this._comments, comment);
  }
}
