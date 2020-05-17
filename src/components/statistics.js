import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatTime, capitalizeString} from "../utils/format.js";
import {getCardsByFilter, getWatchedMoviesByStatisticsFilter} from "../utils/filter.js";
import {getRankName} from "../utils/rank-name.js";
import {GENRE_NAMES, FilterType, StatisticsFilterType} from "../const.js";

const BAR_HEIGHT = 50;

const renderStatisticsChart = (statisticCtx, dataSetGenres) => {
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: dataSetGenres.map((genre) => {
        return genre.name;
      }),
      datasets: [{
        data: dataSetGenres.map((genre) => {
          return genre.count;
        }),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createFilterMarkup = (filter, isChecked) => {
  const formatedFilter = filter.toLowerCase().replace(` `, `-`);
  const checked = isChecked ? `checked` : ``;
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${formatedFilter}" value="${formatedFilter}" ${checked}>
  <label for="statistic-${formatedFilter}" class="statistic__filters-label">${filter}</label>`
  );
};

const createTopGenreMarkup = (topGenre) => {
  if (topGenre === ``) {
    return ``;
  }
  return (
    `<li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>`
  );
};

const createStatisticsTemplate = (watchedMoviesAll, watchedMovies, totalDuration, topGenre, activeFilter) => {
  const filtersMarkup = Object.values(StatisticsFilterType).map((filter) => {
    const checked = (activeFilter === filter) ? true : false;
    return createFilterMarkup(filter, checked);
  }).join(`\n`);

  const topGenreMarkup = createTopGenreMarkup(topGenre);
  const rankName = getRankName(watchedMoviesAll.length);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rankName}</span>
      </p>
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${filtersMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedMovies.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${formatTime(totalDuration)}</p>
        </li>
        ${topGenreMarkup}
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(cardsModel) {
    super();
    this._cardsModel = cardsModel;

    this._watchedMovies = null;
    this._watchedMoviesByFilter = null;
    this._totalDuration = null;
    this._topGenre = null;
    this._dataSetGenres = null;

    this._filter = null;
  }

  _updateData() {
    this._watchedMovies = getCardsByFilter(FilterType.HISTORY, this._cardsModel.getCardsAll());
    this._watchedMoviesByFilter = getWatchedMoviesByStatisticsFilter(this._filter, this._watchedMovies);
    this._totalDuration = 0;
    this._topGenre = ``;

    this._dataSetGenres = GENRE_NAMES.map((genre) => {
      return {
        name: genre,
        count: 0,
      };
    });

    if (this._watchedMoviesByFilter.length !== 0) {
      this._watchedMoviesByFilter.forEach((card) => {
        this._dataSetGenres.forEach((genre) => {
          card.genre.forEach((cardGenre) => {
            if (cardGenre === genre.name) {
              genre.count++;
            }
          });
        });
        this._totalDuration += card.duration;
      });
      this._dataSetGenres.sort((a, b) => b.count - a.count);
      this._topGenre = this._dataSetGenres[0].name;
    }
  }

  getTemplate() {
    this._updateData();
    return createStatisticsTemplate(this._watchedMovies, this._watchedMoviesByFilter, this._totalDuration, this._topGenre, this._filter);
  }

  show() {
    super.show();
    this._filter = StatisticsFilterType.ALL_TIME;
    this.rerender();
  }

  rerender() {
    super.rerender();
    if (this._watchedMoviesByFilter.length !== 0) {
      this._renderCharts();
    }
  }

  recoveryListeners() {
    this._setActiveFilter();
  }

  _renderCharts() {
    const statisticsCtx = this.getElement().querySelector(`.statistic__chart`);
    statisticsCtx.height = BAR_HEIGHT * 5;
    this._resetCharts();
    this._statisticsChart = renderStatisticsChart(statisticsCtx, this._dataSetGenres);
  }

  _resetCharts() {
    if (this._statisticsChart) {
      this._statisticsChart.destroy();
      this._statisticsChart = null;
    }
  }

  _setActiveFilter() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._filter = capitalizeString(evt.target.value.replace(`-`, ` `));
      this.rerender();
    });
  }
}
