const CONTROL_KEYS = [`isFavorite`, `isInWatchlist`, `isWatched`];

export const checkControlsOnChange = (oldCard, newCard) => {
  let isCardControlsChanged = false;
  Object.keys(newCard).forEach((key) => {
    if (oldCard[key] !== newCard[key]) {
      if (CONTROL_KEYS.includes(key)) {
        isCardControlsChanged = true;
      }
    }
  });
  return isCardControlsChanged;
};


