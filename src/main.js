import API from "./api.js";
import PageController from "./controllers/page-controller.js";
import FilterController from "./controllers/filter-controller.js";
import ProfileController from "./controllers/profile-controller.js";
import MainNavigationComponent from "./components/main-navigation.js";
import FilmsBoardComponent from "./components/films-board.js";
import StatisticsComponent from "./components/statistics.js";
import FilmsCountComponent from "./components/films-count.js";
import CardsModel from './models/cards.js';
import {ActiveScreen} from "./const.js";
import {RenderPosition, render} from "./utils/render.js";

const AUTHORIZATION = `Basic uigsdfjhg2835*BFk`;

const api = new API(AUTHORIZATION);
const cardsModel = new CardsModel(api);

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

const profileController = new ProfileController(siteHeaderElement, cardsModel);
const mainNavigationComponent = new MainNavigationComponent();
const filterController = new FilterController(mainNavigationComponent.getElement(), cardsModel, onScreenChangeHandler);
const filmsBoardComponent = new FilmsBoardComponent();
const pageController = new PageController(filmsBoardComponent, cardsModel);
const statisticsComponent = new StatisticsComponent(cardsModel);

profileController.render();
render(siteMainElement, mainNavigationComponent, RenderPosition.BEFOREEND);
mainNavigationComponent.setActiveScreenChangeHandler(onScreenChangeHandler);
filterController.render();
render(siteMainElement, filmsBoardComponent, RenderPosition.BEFOREEND);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

api.getCards()
  .then((cards) => {
    cardsModel.setCards(cards);
    pageController.render();
    const filmsCountComponent = new FilmsCountComponent(cardsModel.getCardsAll().length);
    render(siteCountStatisticsElement, filmsCountComponent, RenderPosition.BEFOREEND);
  });
