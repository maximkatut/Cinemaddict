export const getRandomIntegerNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const getRandomFloatNumber = (min, max, fractionalLength) => {
  return (min + Math.random() * (max - min)).toFixed(fractionalLength);
};

export const getRandomArrayItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

export const getRandomArrayItems = (arr, from, to) => {
  return new Array(getRandomIntegerNumber(from, to)).fill(``).map(() => {
    return arr[getRandomIntegerNumber(0, arr.length - 1)];
  });
};

export const getTwoRandomItems = (arr) => {
  const firstIndex = getRandomIntegerNumber(0, arr.length - 1);
  let secondIndex;
  do {
    secondIndex = getRandomIntegerNumber(0, arr.length - 1);
  } while (secondIndex === firstIndex);
  return [arr[firstIndex], arr[secondIndex]];
};
