import {generateComments} from "./comment.js";
import {MONTH_NAMES} from "../const.js";
import {getRandomIntegerNumber, getRandomBoolean, getRandomArrayItem, getRandomFloatNumber} from "../utils/format.js";

const cardNames = [
  `Побег из Шоушенка`,
  `Зеленая миля`,
  `Форрест Гамп`,
  `Список Шиндлера`,
  `1+1`,
  `Начало`,
  `Леон`,
  `Король лев`,
  `Бойцовский клуб`,
];

const posterNames = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
];

const descriptionSentences = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const genreNames = [
  `Action`,
  `Comedy`,
  `Drama`,
  `Fantasy`,
  `Horror`,
];

const countryNames = [
  `USA`,
  `Russia`,
  `Moldova`,
  `Belarus`,
  `Tanzania`,
];

const peopleNames = [
  `Zachery Gaulding`,
  `Alfonso Haase`,
  `Scottie Asaro`,
  `Jacques Janzen`,
  `Waldo Fulks`,
  `Maddie Evanoff`,
  `Son Brouillard`,
  `Louvenia Choate`,
  `Maureen Bowdoin`,
  `Britni Nobile`,
  `Alina Baravy`,
];

const getRandomArrayItems = (arr, from, to) => {
  return new Array(getRandomIntegerNumber(from, to)).fill(``).map(() => {
    return arr[getRandomIntegerNumber(0, arr.length)];
  });
};

const getRandomDurationInMinutes = (from, to) => {
  const minutes = getRandomIntegerNumber(from, to);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const generateCard = () => {
  return {
    poster: `./images/posters/${getRandomArrayItem(posterNames)}`,
    name: getRandomArrayItem(cardNames),
    originalName: getRandomArrayItem(cardNames),
    rating: getRandomFloatNumber(5, 5, 1),
    director: getRandomArrayItem(peopleNames),
    writers: getRandomArrayItems(peopleNames, 1, 3),
    actors: getRandomArrayItems(peopleNames, 1, 3),
    releaseDate: new Date(`${getRandomIntegerNumber(1920, 100)} ${getRandomArrayItem(MONTH_NAMES)} ${getRandomIntegerNumber(1, 30)}`),
    duration: getRandomDurationInMinutes(50, 150),
    country: getRandomArrayItem(countryNames),
    genre: getRandomArrayItems(genreNames, 1, 3),
    description: getRandomArrayItems(descriptionSentences, 1, 5).join(` `),
    ageRating: `${getRandomIntegerNumber(16, 2)}+`,
    comments: generateComments(getRandomIntegerNumber(0, 5)),
    isInWatchlist: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
  };
};

const generateCards = (count) => {
  return new Array(count).fill(``).map(generateCard);
};

export {generateCards};