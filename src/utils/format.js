import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

export const formatTime = (minutes) => {
  return moment.duration(minutes, `minutes`).format(`h[h] mm[m]`);
};

export const formatDate = (date) => {
  return moment(date).format(`D MMMM YYYY`);
};

export const formatRelativeDate = (date) => {
  return moment(date).fromNow();
};

export const capitalizeString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
