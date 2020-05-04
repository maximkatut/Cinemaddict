import moment from 'moment';

export const formatTime = (minutes) => {
  const duration = moment.duration(minutes, `m`).as(`milliseconds`);
  if (duration < 36e5) {
    return moment.utc(duration).format(`m[m]`);
  } else {
    return moment.utc(duration).format(`h[h] mm[m]`);
  }
};

export const formatDate = (date) => {
  return moment(date).format(`D MMMM YYYY`);
};

export const formatRelativeDate = (date) => {
  return moment(date).fromNow();
};
