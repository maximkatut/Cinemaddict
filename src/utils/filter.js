import {FilterType, StatisticsFilterType} from "../const.js";
import moment from "moment";

const Time = {
  START_OF_TODAY: moment().startOf(`day`),
  END_OF_YESTERDAY: moment().subtract(1, `days`).endOf(`day`),
  WEEK_AGO: moment().subtract(7, `days`).startOf(`day`),
  MONTH_AGO: moment().subtract(1, `months`).startOf(`day`),
  YEAR_AGO: moment().subtract(1, `years`).startOf(`day`),
};

export const getCardsByFilter = (filterType, cards) => {
  switch (filterType) {
    case FilterType.ALL:
      return cards;
    case FilterType.WATCHLIST:
      return cards.filter((card) => {
        return card.isInWatchlist;
      });
    case FilterType.HISTORY:
      return cards.filter((card) => {
        return card.isWatched;
      });
    case FilterType.FAVORITES:
      return cards.filter((card) => {
        return card.isFavorite;
      });
  }
  return cards;
};

export const getWatchedMoviesByStatisticsFilter = (filter, cards) => {
  switch (filter) {
    case StatisticsFilterType.ALL_TIME:
      return cards;
    case StatisticsFilterType.TODAY:
      return cards.filter((card) => {
        return card.watchingDate >= Time.START_OF_TODAY;
      });
    case StatisticsFilterType.WEEK:
      return cards.filter((card) => {
        return card.watchingDate > Time.WEEK_AGO && card.watchingDate < Time.END_OF_YESTERDAY;
      });
    case StatisticsFilterType.MONTH:
      return cards.filter((card) => {
        return card.watchingDate > Time.MONTH_AGO && card.watchingDate < Time.END_OF_YESTERDAY;
      });
    case StatisticsFilterType.YEAR:
      return cards.filter((card) => {
        return card.watchingDate > Time.YEAR_AGO && card.watchingDate < Time.END_OF_YESTERDAY;
      });
  }
  return cards;
};
