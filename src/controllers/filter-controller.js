import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getCardsByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, cardsModel, onScreenChange) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
    this._watchedMoviesCount = 0;

    this._onScreenChange = onScreenChange;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._cardsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const allCards = this._cardsModel.getCardsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getCardsByFilter(filterType, allCards).length,
        checked: filterType === this._activeFilterType,
      };
    });

    this._watchedMoviesCount = filters[2].count;

    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    this._filterComponent.setActiveScreenChangeHandler(this._onScreenChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange(filterType) {
    this._cardsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  removeActiveClass() {
    this._activeFilterType = ``;
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
