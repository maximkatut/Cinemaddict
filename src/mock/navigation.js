import {cards} from "../main.js";

const filterNames = [
  `Watchlist`, `History`, `Favorites`
];

const getWatchlistCount = () => {
  let counter = 0;
  cards.forEach((it) => {
    if (it.isInWatchlist) {
      counter++;
    }
  });
  return counter;
};

const getHistoryCount = () => {
  let counter = 0;
  cards.forEach((it) => {
    if (it.isWatched) {
      counter++;
    }
  });
  return counter;
};

const getFavoritesCount = () => {
  let counter = 0;
  cards.forEach((it) => {
    if (it.isFavorite) {
      counter++;
    }
  });
  return counter;
};

export const generateFilters = () => {
  return filterNames.map((it, i) => {
    const filterCounts = [
      getWatchlistCount(),
      getHistoryCount(),
      getFavoritesCount(),
    ];
    return {
      name: it,
      count: filterCounts[i],
    };
  });
};
