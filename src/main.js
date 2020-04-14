import {createProfileTemplate} from "./components/profile.js";
import {createNavigationTemplate} from "./components/navigation.js";
import {createSortTemplate} from "./components/sort.js";
import {createFilmsListsBoardTemplate} from "./components/films-board.js";
import {createFilmCardTemplate} from "./components/card.js";
import {createLoadMoreButtonTemplate} from "./components/more-button.js";
import {createTopFilmsListsBoardTemplate} from "./components/top-films-board.js";
import {createMostCommentedFilmsListsBoardTemplate} from "./components/most-commented-films-board.js";
import {createPopupBoardTemplate} from "./components/popup-board.js";
import {createPopupInfoTemplate} from "./components/popup-info.js";
import {createPopupControlsTemplate} from "./components/popup-controls.js";
import {createPopupCommentsTemplate} from "./components/popup-comments.js";
import {createFilmsCountTemplate} from "./components/films-count.js";
import {generateCards} from "./mock/card.js";
import {generateFilters} from "./mock/navigation.js";
import {selectMostCommentedCards, selectTopCards} from "./utils/cardsSelector.js";

// CONSTANTS
const CARDS_COUNT = 25;
const CARDS_COUNT_ON_START = 5;
const CARDS_COUNT_LOAD_MORE_BUTTON = 5;

// Variables
const cards = generateCards(CARDS_COUNT);
const navigationFilters = generateFilters(cards);
const topRatedCards = selectTopCards(cards);
const mostCommentedCards = selectMostCommentedCards(cards);
const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

// render function
const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

// Rendering profile, navigation(filters) and sorting menu

const watchedFilmsCount = navigationFilters[2].count;

render(siteHeaderElement, createProfileTemplate(watchedFilmsCount));
render(siteMainElement, createNavigationTemplate(navigationFilters));
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsListsBoardTemplate());

// rendering `Show more` button
const siteFilms = siteMainElement.querySelector(`.films`);
const siteFilmsLists = siteMainElement.querySelector(`.films-list`);
render(siteFilmsLists, createLoadMoreButtonTemplate());

const siteFilmsListsContainerElement = siteFilmsLists.querySelector(`.films-list__container`);
const moreButtonElement = siteFilmsLists.querySelector(`.films-list__show-more`);

// Rendering cards and cards that showing `CARDS_COUNT_LOAD_MORE_BUTTON` cards by click show more button
let showingCardsCount = CARDS_COUNT_ON_START;
cards
  .slice(0, showingCardsCount)
  .forEach((it) => render(siteFilmsListsContainerElement, createFilmCardTemplate(it)));

const removeMoreButton = () => {
  if (showingCardsCount >= CARDS_COUNT) {
    moreButtonElement.remove();
  }
};

removeMoreButton();

moreButtonElement.addEventListener(`click`, () => {
  const showedCardsCount = showingCardsCount;
  showingCardsCount += CARDS_COUNT_LOAD_MORE_BUTTON;
  cards
    .slice(showedCardsCount, showingCardsCount)
    .forEach((it) => render(siteFilmsListsContainerElement, createFilmCardTemplate(it)));
  removeMoreButton();
});

// Rendering TOP RATED and MOST COMMENTED movies containers and cards
// if topRatedCards or mostCommentedCards === 0 => do not render them
if (topRatedCards.length > 0) {
  render(siteFilms, createTopFilmsListsBoardTemplate());
  const siteFilmsListsTopRated = siteMainElement.querySelector(`.films-list--top-rated`);
  const siteTopFilmsListsContainer = siteFilmsListsTopRated.querySelector(`.films-list__container`);
  topRatedCards.forEach((card) => {
    render(siteTopFilmsListsContainer, createFilmCardTemplate(card));
  });
}

if (mostCommentedCards.length > 0) {
  render(siteFilms, createMostCommentedFilmsListsBoardTemplate());
  const siteFilmsListsMostCommented = siteMainElement.querySelector(`.films-list--most-commented`);
  const siteMostCommFilmsListsContainer = siteFilmsListsMostCommented.querySelector(`.films-list__container`);
  mostCommentedCards.forEach((card) => {
    render(siteMostCommFilmsListsContainer, createFilmCardTemplate(card));
  });
}

// Rendering popup of active filmcard
render(siteBodyElement, createPopupBoardTemplate());

const sitePopupTopContainer = siteBodyElement.querySelector(`.form-details__top-container`);
render(sitePopupTopContainer, createPopupInfoTemplate(cards[0]));
render(sitePopupTopContainer, createPopupControlsTemplate(cards[0]));
render(sitePopupTopContainer, createPopupCommentsTemplate(cards[0].comments), `afterend`);

// Rendering count of all movies
const siteCountStatisticsContainer = document.querySelector(`.footer__statistics`);
render(siteCountStatisticsContainer, createFilmsCountTemplate(cards.length));
