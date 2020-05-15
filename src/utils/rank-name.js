import {RankName} from "../const.js";

export const getRankName = (count) => {
  let rank = ``;
  if (count > 20) {
    rank = RankName.MOVIE_BUFF;
  } else
  if (count <= 20 && count > 10) {
    rank = RankName.FAN;
  } else
  if (count <= 10) {
    rank = RankName.NOVICE;
  } else
  if (count === 0) {
    rank = ``;
  }
  return rank;
};
