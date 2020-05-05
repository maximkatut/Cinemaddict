import {FilterType} from "../const.js";

export const getCardsByFilter = (filterType, cards) => {
  switch (filterType) {
    case FilterType.ALL:
      return cards;
    case FilterType.WATCHLIST:
      return cards.filter((card) => {
        return card.isInWatchlist;
      });
    case FilterType.HISTORY:
      return cards.filter((card) => {
        return card.isWatched;
      });
    case FilterType.FAVORITES:
      return cards.filter((card) => {
        return card.isFavorite;
      });
  }
  return cards;
};
