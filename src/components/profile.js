import AbstractComponent from "./abstract-component.js";
import {getRankName} from "../utils/rank-name.js";

const createProfileTemplate = (watchedFilmsCount) => {
  const rank = getRankName(watchedFilmsCount);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractComponent {
  constructor(watchedFilmsCount) {
    super();
    this._watchedFilmsCount = watchedFilmsCount;
  }

  getTemplate() {
    return createProfileTemplate(this._watchedFilmsCount);
  }
}
