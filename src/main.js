import ProfileComponent from "./components/profile.js";
import NavigationComponent from "./components/navigation.js";
import FilmsBoardComponent from "./components/films-board.js";
import PageController from "./controllers/page-controller.js";
import FilmsCountComponent from "./components/films-count.js";
import CardsModel from './models/cards.js';
import {generateCards} from "./mock/card.js";
import {generateFilters} from "./mock/navigation.js";
import {RenderPosition, render} from "./utils/render.js";

// CONSTANTS
const CARDS_COUNT = 25;

// Variables
const cards = generateCards(CARDS_COUNT);
const navigationFilters = generateFilters(cards);
const watchedFilmsCount = navigationFilters[2].count;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// Render profile
render(siteHeaderElement, new ProfileComponent(watchedFilmsCount), RenderPosition.BEFOREEND);

// Render films board
const filmsBoardComponent = new FilmsBoardComponent();
render(siteMainElement, filmsBoardComponent, RenderPosition.BEFOREEND);

const cardsModel = new CardsModel();
cardsModel.setCards(cards);
// Render all films lists
const pageController = new PageController(filmsBoardComponent, cardsModel);
pageController.render();

// Render navigation menu
render(siteMainElement, new NavigationComponent(navigationFilters), RenderPosition.AFTERBEGIN);

// Render count of all movies
const siteCountStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteCountStatisticsElement, new FilmsCountComponent(cards.length), RenderPosition.BEFOREEND);
