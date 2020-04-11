import {cards} from "../main.js";

const sortCards = (prop, propTwo) => {
  const sortedCards = cards.slice().sort((a, b) => {
    if (propTwo === ``) {
      return b[prop] - a[prop];
    } else {
      return b[prop][propTwo] - a[prop][propTwo];
    }
  });

  const filteredCards = sortedCards.filter((it, _, arr) => {
    if (propTwo === ``) {
      return it[prop] === arr[0][prop];
    } else {
      return it[prop][propTwo] === arr[0][prop][propTwo];
    }
  });

  if (filteredCards.length === 1) {
    filteredCards.push(sortedCards[1]);
  }

  if (filteredCards.length > 2) {
    const length = filteredCards.length;
    for (let i = 0; i < length - 2; i++) {
      filteredCards.splice([Math.floor(Math.random() * filteredCards.length)], 1);
    }
  }
  return filteredCards;
};

export {sortCards};
