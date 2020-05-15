import PageController from "./controllers/page-controller.js";
import FilterController from "./controllers/filter-controller.js";
import ProfileComponent from "./components/profile.js";
import MainNavigationComponent from "./components/main-navigation.js";
import FilmsBoardComponent from "./components/films-board.js";
import StatisticsComponent from "./components/statistics.js";
import FilmsCountComponent from "./components/films-count.js";
import CardsModel from './models/cards.js';
import {ActiveScreen, FilterType} from "./const.js";
import {RenderPosition, render} from "./utils/render.js";
import {getCardsByFilter} from "./utils/filter.js";
import {generateCards} from "./mock/card.js";

const CARDS_COUNT = 25;

const cards = generateCards(CARDS_COUNT);
const cardsModel = new CardsModel();
cardsModel.setCards(cards);
const watchedMovies = getCardsByFilter(FilterType.HISTORY, cardsModel.getCardsAll()).length;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteCountStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

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

const profileComponent = new ProfileComponent(watchedMovies);
const mainNavigationComponent = new MainNavigationComponent();
const filterController = new FilterController(mainNavigationComponent.getElement(), cardsModel, onScreenChangeHandler);
const filmsBoardComponent = new FilmsBoardComponent();
const pageController = new PageController(filmsBoardComponent, cardsModel);
const statisticsComponent = new StatisticsComponent(cardsModel);
const filmsCountComponent = new FilmsCountComponent(cards.length);

render(siteHeaderElement, profileComponent, RenderPosition.BEFOREEND);
render(siteMainElement, mainNavigationComponent, RenderPosition.BEFOREEND);
mainNavigationComponent.setActiveScreenChangeHandler(onScreenChangeHandler);
filterController.render();
render(siteMainElement, filmsBoardComponent, RenderPosition.BEFOREEND);
pageController.render();
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();
render(siteCountStatisticsElement, filmsCountComponent, RenderPosition.BEFOREEND);
