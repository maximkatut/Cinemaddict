const emojiNames = [
  `angry`,
  `puke`,
  `sleeping`,
  `smile`,
];

const commentContents = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
];

const commentAuthors = [
  `Tim Macoveev`,
  `Max Baravy`,
  `John Doe`,
  `Makar Vasilyev`,
];

const getRandomDate = () => {
  const targetDate = new Date();
  const diffValue = -1 * Math.floor(Math.random() * 10);
  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const getRandomArrayItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const generateComment = () => {
  return {
    content: getRandomArrayItem(commentContents),
    author: getRandomArrayItem(commentAuthors),
    date: getRandomDate(),
    emoji: `./images/emoji/${getRandomArrayItem(emojiNames)}.png`,
  };
};

const generateComments = (count) => {
  return new Array(count).fill(``).map(generateComment).sort((a, b) => {
    return a.date - b.date;
  });
};

export {generateComments};
