import {getRandomArrayItem} from "../utils/random.js";

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

const generateComment = () => {
  return {
    id: String(new Date() + Math.random()),
    content: getRandomArrayItem(commentContents),
    author: getRandomArrayItem(commentAuthors),
    date: getRandomDate(),
    emoji: getRandomArrayItem(emojiNames),
  };
};

const generateComments = (count) => {
  return new Array(count).fill(``).map(generateComment).sort((leftComment, rightComment) => {
    return leftComment.date - rightComment.date;
  });
};

export {generateComments};
