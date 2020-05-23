import PopupCommentComponent from "../components/popup-comment.js";
import {RenderPosition, render, remove} from "../utils/render.js";

export default class CommentController {
  constructor(container, onCommentsDataChange) {
    this._container = container;
    this._onCommentsDataChange = onCommentsDataChange;

    this._comment = {};
    this._commentComponent = null;
  }

  render(comment) {
    this._comment = comment;
    this._commentComponent = new PopupCommentComponent(this._comment);
    render(this._container, this._commentComponent, RenderPosition.BEFOREEND);

    this._commentComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onCommentsDataChange(this._comment.id, null);
    });
  }

  setDeleteButtonData(data) {
    this._commentComponent.setButtonData(data);
  }

  getCommentId() {
    return this._comment.id;
  }

  destroy() {
    remove(this._commentComponent);
  }
}
