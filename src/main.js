import {createProfileTemplate} from "./components/profile.js";
import {createNavigationTemplate} from "./components/navigation.js";
import {createSortTemplate} from "./components/sort.js";
import {createFilmsListsBoardTemplate} from "./components/films-board.js";
import {createFilmCardTemplate} from "./components/card.js";
import {createLoadMoreButtonTemplate} from "./components/more-button.js";
import {createTopFilmsListsBoardTemplate} from "./components/top-films-board.js";
import {createTopFilmCardTemplate} from "./components/top-film-card.js";
import {createMostCommFilmsListsBoardTemplate} from "./components/most-comm-films-board.js";
import {createMostCommFilmCardTemplate} from "./components/most-comm-film-card.js";
import {createPopupBoardTemplate} from "./components/popup-board.js";
import {createPopupInfoTemplate} from "./components/popup-info.js";
import {createPopupControlsTemplate} from "./components/popup-controls.js";
import {createPopupCommentsTemplate} from "./components/popup-comments.js";
import {generateCards} from "./mock/card.js";

const CARDS_COUNT = 20;
const CARDS_COUNT_ON_START = 5;
const CARDS_COUNT_LOAD_MORE_BUTTON = 5;
const EXTRA_CARD_COUNT = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const cards = generateCards(CARDS_COUNT);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createProfileTemplate());
render(siteMainElement, createNavigationTemplate());
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

const removeMoreBtn = () => {
  if (showingCardsCount >= CARDS_COUNT) {
    moreButton.remove();
  }
};

removeMoreBtn();

moreButton.addEventListener(`click`, () => {
  const showedCardsCount = showingCardsCount;
  showingCardsCount += CARDS_COUNT_LOAD_MORE_BUTTON;
  cards
    .slice(showedCardsCount, showingCardsCount)
    .forEach((it) => render(siteFilmsListsContainer, createFilmCardTemplate(it)));
  removeMoreBtn();
});

const siteFilmsListsExtras = siteMainElement.querySelectorAll(`.films-list--extra`);
const siteTopFilmsListsContainer = siteFilmsListsExtras[0].querySelector(`.films-list__container`);
const siteMostCommFilmsListsContainer = siteFilmsListsExtras[1].querySelector(`.films-list__container`);

for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
  render(siteTopFilmsListsContainer, createTopFilmCardTemplate());
  render(siteMostCommFilmsListsContainer, createMostCommFilmCardTemplate());
}

const siteBody = document.querySelector(`body`);

render(siteBody, createPopupBoardTemplate());

const sitePopupTopContainer = siteBody.querySelector(`.form-details__top-container`);

render(sitePopupTopContainer, createPopupInfoTemplate(cards[0]));
render(sitePopupTopContainer, createPopupControlsTemplate());
render(sitePopupTopContainer, createPopupCommentsTemplate(), `afterend`);
