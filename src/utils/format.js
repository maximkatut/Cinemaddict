import {MONTH_NAMES} from "../const.js";

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatDate = (date) => {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = Number(date.getFullYear());

  return `${day} ${month} ${year}`;
};

export const formatSlashDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = Number(date.getFullYear());

  return `${year}/${month}/${day}`;
};
