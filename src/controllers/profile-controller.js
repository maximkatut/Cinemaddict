import ProfileComponent from "../components/profile.js";
import {FilterType} from "../const.js";
import {getCardsByFilter} from "../utils/filter.js";
import {RenderPosition, render, replace} from "../utils/render.js";

export default class ProfileController {
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._profileComponent = null;
    this._watchedMoviesCount = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._cardsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    this._watchedMoviesCount = getCardsByFilter(FilterType.HISTORY, this._cardsModel.getCardsAll()).length;
    const oldComponent = this._profileComponent;
    this._profileComponent = new ProfileComponent(this._watchedMoviesCount);

    if (oldComponent) {
      replace(this._profileComponent, oldComponent);
    } else {
      render(this._container, this._profileComponent, RenderPosition.BEFOREEND);
    }
  }

  _onDataChange() {
    this.render();
  }
}
