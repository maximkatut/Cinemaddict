const sortCards = (cards, prop, propTwo) => {
  const sortedCards = cards.slice().sort((leftCard, rightCard) => {
    if (propTwo === ``) {
      return rightCard[prop] - leftCard[prop];
    } else {
      return rightCard[prop][propTwo] - leftCard[prop][propTwo];
    }
  });

  const filteredCards = sortedCards.filter((card, _, arr) => {
    if (propTwo === ``) {
      return card[prop] === arr[0][prop];
    } else {
      return card[prop][propTwo] === arr[0][prop][propTwo];
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
