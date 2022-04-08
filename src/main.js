import API from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
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
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
const CARDS_STORE_PREFIX = `cinemaaddict-cards`;
const COMMENTS_STORE_PREFIX = `cinemaaddict-comments`;
const STORE_VER = `v1`;
const CARDS_STORE_NAME = `${CARDS_STORE_PREFIX}-${STORE_VER}`;
const COMMENTS_STORE_NAME = `${COMMENTS_STORE_PREFIX}-${STORE_VER}`;

const api = new API(AUTHORIZATION, END_POINT);
const cardsStore = new Store(CARDS_STORE_NAME, window.localStorage);
const commentsStore = new Store(COMMENTS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, cardsStore, commentsStore);
const cardsModel = new CardsModel();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteCountStatisticsElement = document.querySelector(`.footer__statistics`);

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
const pageController = new PageController(filmsBoardComponent, cardsModel, apiWithProvider);
const statisticsComponent = new StatisticsComponent(cardsModel);

profileController.render();
render(siteMainElement, mainNavigationComponent, RenderPosition.BEFOREEND);
mainNavigationComponent.setActiveScreenChangeHandler(onScreenChangeHandler);
filterController.render();
render(siteMainElement, filmsBoardComponent, RenderPosition.BEFOREEND);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

apiWithProvider.getCards()
  .then((cards) => {
    cardsModel.setCards(cards);
    filmsBoardComponent.deleteLoadingTitle();
    pageController.render();
    const filmsCountComponent = new FilmsCountComponent(cardsModel.getCardsAll().length);
    render(siteCountStatisticsElement, filmsCountComponent, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsBoardComponent.setNoDataTitle();
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (!apiWithProvider.getSyncStatus()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .catch((error) => {
      throw error;
    });
});
