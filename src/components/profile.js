import AbstractComponent from "./abstract-component.js";
import {getRankName} from "../utils/rank-name.js";
const createProfileMarkup = (count) => {
  const rank = getRankName(count);
  return `<p class="profile__rating">${rank}</p>`;
};

const createProfileTemplate = (count) => {
  return (
    `<section class="header__profile profile">
      ${createProfileMarkup(count)}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createProfileTemplate(this._count);
  }
}
