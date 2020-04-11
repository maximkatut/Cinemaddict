import {createProfileTemplate} from "./components/profile.js";
import {createNavigationTemplate} from "./components/navigation.js";
import {createSortTemplate} from "./components/sort.js";
import {createFilmsListsBoardTemplate} from "./components/films-board.js";
import {createFilmCardTemplate} from "./components/card.js";
import {createLoadMoreButtonTemplate} from "./components/more-button.js";
import {createTopFilmsListsBoardTemplate} from "./components/top-films-board.js";
import {createMostCommFilmsListsBoardTemplate} from "./components/most-comm-films-board.js";
import {createPopupBoardTemplate} from "./components/popup-board.js";
import {createPopupInfoTemplate} from "./components/popup-info.js";
import {createPopupControlsTemplate} from "./components/popup-controls.js";
import {createPopupCommentsTemplate} from "./components/popup-comments.js";
import {createFilmsCountTemplate} from "./components/films-count.js";
import {generateCards} from "./mock/card.js";
import {generateFilters} from "./mock/navigation.js";
import {sortCards} from "./components/extra-cards.js";

const CARDS_COUNT = 5;
const CARDS_COUNT_ON_START = 5;
const CARDS_COUNT_LOAD_MORE_BUTTON = 5;

const cards = generateCards(CARDS_COUNT);
const naviFilters = generateFilters();
const topCards = sortCards(`rating`, ``);
const mostCommCards = sortCards(`comments`, `length`);
const siteBody = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createProfileTemplate());
render(siteMainElement, createNavigationTemplate(naviFilters));
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsListsBoardTemplate());

const siteFilms = siteMainElement.querySelector(`.films`);
const siteFilmsLists = siteMainElement.querySelector(`.films-list`);

render(siteFilms, createTopFilmsListsBoardTemplate());
render(siteFilms, createMostCommFilmsListsBoardTemplate());
render(siteFilmsLists, createLoadMoreButtonTemplate());

const siteFilmsListsContainer = siteFilmsLists.querySelector(`.films-list__container`);
const moreButton = siteFilmsLists.querySelector(`.films-list__show-more`);

let showingCardsCount = CARDS_COUNT_ON_START;
cards
  .slice(0, showingCardsCount)
  .forEach((it) => render(siteFilmsListsContainer, createFilmCardTemplate(it)));

const removeMoreButton = () => {
  if (showingCardsCount >= CARDS_COUNT) {
    moreButton.remove();
  }
};

removeMoreButton();

moreButton.addEventListener(`click`, () => {
  const showedCardsCount = showingCardsCount;
  showingCardsCount += CARDS_COUNT_LOAD_MORE_BUTTON;
  cards
    .slice(showedCardsCount, showingCardsCount)
    .forEach((it) => render(siteFilmsListsContainer, createFilmCardTemplate(it)));
  removeMoreButton();
});

const siteFilmsListsExtras = siteMainElement.querySelectorAll(`.films-list--extra`);
const siteTopFilmsListsContainer = siteFilmsListsExtras[0].querySelector(`.films-list__container`);
const siteMostCommFilmsListsContainer = siteFilmsListsExtras[1].querySelector(`.films-list__container`);
topCards.forEach((it) => {
  render(siteTopFilmsListsContainer, createFilmCardTemplate(it));
});
mostCommCards.forEach((it) => {
  render(siteMostCommFilmsListsContainer, createFilmCardTemplate(it));
});

render(siteBody, createPopupBoardTemplate());

const sitePopupTopContainer = siteBody.querySelector(`.form-details__top-container`);
render(sitePopupTopContainer, createPopupInfoTemplate(cards[0]));
render(sitePopupTopContainer, createPopupControlsTemplate(cards[0]));
render(sitePopupTopContainer, createPopupCommentsTemplate(cards[0].comments), `afterend`);

const siteCountStatisticsContainer = document.querySelector(`.footer__statistics`);
render(siteCountStatisticsContainer, createFilmsCountTemplate(cards.length));

export {cards, naviFilters};
