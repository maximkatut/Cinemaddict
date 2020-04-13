import {RANK_NAMES} from "../const.js";

const createProfileMarkup = (navigationFilters) => {
  let rank = ``;
  const count = navigationFilters[1].count;
  if (count > 20) {
    rank = RANK_NAMES[2];
  } else
  if (count <= 20 && count > 10) {
    rank = RANK_NAMES[1];
  } else
  if (count <= 10) {
    rank = RANK_NAMES[0];
  } else
  if (count <= 10) {
    rank = ``;
  }
  return `<p class="profile__rating">${rank}</p>`;
};

export const createProfileTemplate = (navigationFilters) => {
  return (`
    <section class="header__profile profile">
    ${createProfileMarkup(navigationFilters)}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`);
};
