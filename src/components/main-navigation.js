import AbstractComponent from "./abstract-component.js";
import {ActiveScreen} from "../const.js";

const createNavigationTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNavigation extends AbstractComponent {
  getTemplate() {
    return createNavigationTemplate();
  }

  setActiveScreenChangeHandler(handler) {
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      evt.target.classList.add(`main-navigation__item--active`);
      handler(ActiveScreen.STATS);
    });
  }

  removeActiveClass() {
    this.getElement().querySelector(`.main-navigation__additional`).classList.remove(`main-navigation__item--active`);
  }
}
