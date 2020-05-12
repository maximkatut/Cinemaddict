import ProfileComponent from "./components/profile.js";
import FilmsBoardComponent from "./components/films-board.js";
import PageController from "./controllers/page-controller.js";
import FilmsCountComponent from "./components/films-count.js";
import StatisticsComponent from "./components/statistics.js";
import CardsModel from './models/cards.js';
import {generateCards} from "./mock/card.js";
import {RenderPosition, render} from "./utils/render.js";
import FilterController from "./controllers/filter-controller.js";

// CONSTANTS
const CARDS_COUNT = 25;

// Variables
const cards = generateCards(CARDS_COUNT);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const cardsModel = new CardsModel();
cardsModel.setCards(cards);

// Render navigation menu
const filterController = new FilterController(siteMainElement, cardsModel);
filterController.render();
const watchedMovies = filterController.getWatchedMoviesCount();

// Render profile
render(siteHeaderElement, new ProfileComponent(watchedMovies), RenderPosition.BEFOREEND);

// Render films board
const filmsBoardComponent = new FilmsBoardComponent();
render(siteMainElement, filmsBoardComponent, RenderPosition.BEFOREEND);


// Render all films lists
const pageController = new PageController(filmsBoardComponent, cardsModel);
pageController.render();

// Render statistics
const statisticsComponent = new StatisticsComponent();
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);

// Render count of all movies
const siteCountStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteCountStatisticsElement, new FilmsCountComponent(cards.length), RenderPosition.BEFOREEND);
