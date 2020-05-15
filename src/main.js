import ProfileComponent from "./components/profile.js";
import FilmsBoardComponent from "./components/films-board.js";
import PageController from "./controllers/page-controller.js";
import FilmsCountComponent from "./components/films-count.js";
import StatisticsComponent from "./components/statistics.js";
import MainNavigationComponent from "./components/main-navigation.js";
import CardsModel from './models/cards.js';
import {generateCards} from "./mock/card.js";
import {RenderPosition, render} from "./utils/render.js";
import {getCardsByFilter} from "./utils/filter.js";
import FilterController from "./controllers/filter-controller.js";
import {ActiveScreen, FilterType} from "./const.js";

// CONSTANTS
const CARDS_COUNT = 25;

// Variables
const cards = generateCards(CARDS_COUNT);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const cardsModel = new CardsModel();
cardsModel.setCards(cards);

const onScreenChangeHandler = (activeScreen) => {
  switch (activeScreen) {
    case ActiveScreen.STATS:
      statisticsComponent.show();
      pageController.hide();
      filterController.removeActiveClass();
      break;
    case ActiveScreen.MOVIES:
      pageController.show();
      statisticsComponent.hide();
      mainNavigationComponent.removeActiveClass();
      break;
  }
};

const mainNavigationComponent = new MainNavigationComponent();
render(siteMainElement, mainNavigationComponent, RenderPosition.BEFOREEND);
mainNavigationComponent.setActiveScreenChangeHandler(onScreenChangeHandler);

// Render navigation menu
const filterController = new FilterController(mainNavigationComponent.getElement(), cardsModel, onScreenChangeHandler);
filterController.render();
const watchedMovies = getCardsByFilter(FilterType.HISTORY, cardsModel.getCardsAll());

// Render profile
render(siteHeaderElement, new ProfileComponent(watchedMovies), RenderPosition.BEFOREEND);

// Render films board
const filmsBoardComponent = new FilmsBoardComponent();
render(siteMainElement, filmsBoardComponent, RenderPosition.BEFOREEND);

// Render all films lists
const pageController = new PageController(filmsBoardComponent, cardsModel);
pageController.render();

// Render statistics
const statisticsComponent = new StatisticsComponent(cardsModel);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

// Render count of all movies
const siteCountStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteCountStatisticsElement, new FilmsCountComponent(cards.length), RenderPosition.BEFOREEND);
