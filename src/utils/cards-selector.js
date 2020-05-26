const SHOWED_EXTRA_CARDS = 2;

const getRandomIntegerNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getTwoRandomItems = (arr) => {
  const firstIndex = getRandomIntegerNumber(0, arr.length - 1);
  let secondIndex;
  do {
    secondIndex = getRandomIntegerNumber(0, arr.length - 1);
  } while (secondIndex === firstIndex);
  return [arr[firstIndex], arr[secondIndex]];
};

export const selectMostCommentedCards = (cards) => {
  if (cards.every((card) => card.comments.length === 0) || cards.length === 0) {
    return [];
  }

  if (cards.length === 1) {
    return [cards[0]];
  }

  if (cards.every((card) => card.comments.length === cards[0].comments.length)) {
    return getTwoRandomItems(cards);
  }

  return cards
    .slice()
    .sort((leftCard, rightCard) => rightCard.comments.length - leftCard.comments.length)
    .slice(0, SHOWED_EXTRA_CARDS)
    .filter((card) => card.comments.length > 0);
};

export const selectTopCards = (cards) => {
  if (cards.every((card) => card.rating === 0) || cards.length === 0) {
    return [];
  }

  if (cards.length === 1) {
    return [cards[0]];
  }

  if (cards.every((card) => card.rating === cards[0].rating)) {
    return getTwoRandomItems(cards);
  }

  return cards
    .slice()
    .sort((leftCard, rightCard) => {
      return rightCard.rating - leftCard.rating;
    })
    .slice(0, SHOWED_EXTRA_CARDS)
    .filter((card) => card.rating > 0);
};
