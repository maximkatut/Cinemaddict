import {getRandomBoolean} from "../utils/format.js";

const filterNames = [
  `All movies`, `Watchlist`, `History`, `Favorites`
];

const countFilter = (prop, cards) => {
  let counter = 0;
  cards.forEach((it) => {
    if (it[prop]) {
      counter++;
    }
  });
  return counter;
};

const generateFilters = (cards) => {
  const filterCounts = [
    countFilter(``, cards),
    countFilter(`isInWatchlist`, cards),
    countFilter(`isWatched`, cards),
    countFilter(`isFavorite`, cards),
  ];
  return filterNames.map((it, i) => {
    return {
      name: it,
      count: filterCounts[i],
      isActive: getRandomBoolean(),
    };
  });
};

export {generateFilters};
