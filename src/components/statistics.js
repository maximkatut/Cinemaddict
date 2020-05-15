import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatTime} from "../utils/format.js";
import {GENRE_NAMES} from "../const.js";

const BAR_HEIGHT = 50;

const getTopGenre = (array) => {
  let counts = {};
  let compare = 0;
  let mostFrequent;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i];
    if (counts[item] === undefined) {
      counts[item] = 1;
    } else {
      counts[item] = counts[item] + 1;
    }
    if (counts[item] > compare) {
      compare = counts[item];
      mostFrequent = array[i];
    }
  }
  return mostFrequent;
};

let dataSetGenres = {};

const renderStatisticsChart = (statisticCtx) => {
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

const createStatisticsTemplate = (cards) => {
  const watchedMovies = cards.filter((card) => {
    return card.isWatched === true;
  });

  const statisticRankMarkup = (topGenre) => {
    if (topGenre === ``) {
      return ``;
    }
    return (
      `<p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${topGenre}er</span>
      </p>`
    );
  };

  const topGenreMarkup = (topGenre) => {
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

  const allGenres = [];
  let totalDuration = 0;
  let topGenre = ``;

  if (watchedMovies.length !== 0) {
    totalDuration = watchedMovies.map((card) => card.duration).reduce((acc, current) => acc + current);
    watchedMovies.forEach((card) => allGenres.push(...card.genre));
    topGenre = getTopGenre(allGenres);
  }

  dataSetGenres = GENRE_NAMES.map((item) => {
    let count = 0;
    allGenres.forEach((genre) => {
      if (genre === item) {
        count++;
      }
    });
    return {
      name: item,
      count,
    };
  }).sort((a, b) => b.count - a.count);

  return (
    `<section class="statistic">
      ${statisticRankMarkup(topGenre)}
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
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
        ${topGenreMarkup(topGenre)}
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
  }

  getTemplate() {
    return createStatisticsTemplate(this._cardsModel.getCardsAll());
  }

  show() {
    super.show();
    this.rerender();
  }

  rerender() {
    super.rerender();
    this._renderCharts();
  }

  recoveryListeners() {}

  _renderCharts() {
    const statisticsCtx = this.getElement().querySelector(`.statistic__chart`);
    statisticsCtx.height = BAR_HEIGHT * 5;
    this._resetCharts();
    this._statisticsChart = renderStatisticsChart(statisticsCtx);
  }

  _resetCharts() {
    if (this._statisticsChart) {
      this._statisticsChart.destroy();
      this._statisticsChart = null;
    }
  }
}
