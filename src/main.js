import ProfileComponent from "./components/profile.js";
import NavigationComponent from "./components/navigation.js";
import SortComponent from "./components/sort.js";
import FilmsBoardComponent from "./components/films-board.js";
import PageController from "./controllers/page-controller.js";
import FilmsCountComponent from "./components/films-count.js";
import {generateCards} from "./mock/card.js";
import {generateFilters} from "./mock/navigation.js";
import {RenderPosition, render} from "./utils/render.js";

// CONSTANTS
const CARDS_COUNT = 12025;
// Variables
const cards = generateCards(CARDS_COUNT);
const navigationFilters = generateFilters(cards);
const watchedFilmsCount = navigationFilters[2].count;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// Render profile, navigation(filters) and sorting menu
render(siteHeaderElement, new ProfileComponent(watchedFilmsCount), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationComponent(navigationFilters), RenderPosition.BEFOREEND);
render(siteMainElement, new SortComponent(), RenderPosition.BEFOREEND);

// Render films board
const filmsBoardComponent = new FilmsBoardComponent();
render(siteMainElement, filmsBoardComponent, RenderPosition.BEFOREEND);

// Render all films lists
const pageController = new PageController(filmsBoardComponent);
pageController.render(cards);

// Render count of all movies
const siteCountStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteCountStatisticsElement, new FilmsCountComponent(cards.length), RenderPosition.BEFOREEND);
