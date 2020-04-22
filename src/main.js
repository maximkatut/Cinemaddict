import ProfileComponent from "./components/profile.js";
import NavigationComponent from "./components/navigation.js";
import SortComponent from "./components/sort.js";
import FilmsBoardComponent from "./components/films-board.js";
import CardComponent from "./components/card.js";
import MoreButtonComponent from "./components/more-button.js";
import TopFilmsBoardComponent from "./components/top-films-board.js";
import MostCommentedFilmsBoardComponent from "./components/most-commented-films-board.js";
import PopupBoardComponent from "./components/popup-board.js";
import PopupInfoComponent from "./components/popup-info.js";
import PopupControlsComponent from "./components/popup-controls.js";
import PopupCommentsComponent from "./components/popup-comments.js";
import FilmsCountComponent from "./components/films-count.js";
import NoCardsComponent from "./components/no-cards.js";
import {generateCards} from "./mock/card.js";
import {generateFilters} from "./mock/navigation.js";
import {selectMostCommentedCards, selectTopCards} from "./utils/cardsSelector.js";
import {RenderPosition, render} from "./utils/render.js";

// CONSTANTS
const CARDS_COUNT = 25;
const CARDS_COUNT_ON_START = 5;
const CARDS_COUNT_LOAD_MORE_BUTTON = 5;
// Rendering card function that depends on place
const renderCard = (cardListElement, card) => {
// Handler for each filmCard to open popup
  const onOpenPopupClick = () => {
    // Render popup of active filmcard
    renderPopup(card);
  };
  // Rendering the actual card
  const cardComponent = new CardComponent(card);
  render(cardListElement, cardComponent.getElement(), RenderPosition.BEFOREEND);
  // Add listeners for poster, name and comments to open popup
  const cardPosterElement = cardComponent.getElement().querySelector(`.film-card__poster`);
  const cardTitleElement = cardComponent.getElement().querySelector(`.film-card__title`);
  const cardCommentsElement = cardComponent.getElement().querySelector(`.film-card__comments`);
  cardPosterElement.addEventListener(`click`, onOpenPopupClick);
  cardTitleElement.addEventListener(`click`, onOpenPopupClick);
  cardCommentsElement.addEventListener(`click`, onOpenPopupClick);
};
// Rendering popup function
const renderPopup = (card) => {
  // Handler to close popup with ESC
  const onKeyDown = (evt) => {
    const isEscapeKey = evt.key === `Esc` || evt.key === `Escape`;
    if (isEscapeKey) {
      popupBoardElement.remove();
      popupBoardComponent.removeElement();
    }
    document.removeEventListener(`keydown`, onKeyDown);
  };
  // Handler to close popup with click on cross button
  const onCloseButtonClick = () => {
    popupBoardElement.remove();
    popupBoardComponent.removeElement();
  };
  const popupBoardComponent = new PopupBoardComponent();
  const popupBoardElement = popupBoardComponent.getElement();
  const sitePopupContainer = popupBoardElement.querySelector(`.form-details__top-container`);
  const sitePopupCommentsContainer = popupBoardElement.querySelector(`.film-details__inner`);
  const closeButton = sitePopupContainer.querySelector(`.film-details__close`);

  render(siteBodyElement, popupBoardElement, RenderPosition.BEFOREEND);
  render(sitePopupContainer, new PopupInfoComponent(card).getElement(), RenderPosition.BEFOREEND);
  render(sitePopupContainer, new PopupControlsComponent(card).getElement(), RenderPosition.BEFOREEND);
  render(sitePopupCommentsContainer, new PopupCommentsComponent(card.comments).getElement(), RenderPosition.BEFOREEND);

  closeButton.addEventListener(`click`, onCloseButtonClick);
  document.addEventListener(`keydown`, onKeyDown);
};
// Rendering board function
const renderFilmsBoard = (filmsBoardElement, cards) => {
  const siteFilmsListContainerElement = filmsBoardElement.querySelector(`.films-list__container`);
  const siteFilmsListElement = filmsBoardElement.querySelector(`.films-list`);
  const siteFilmsListTitleElement = siteFilmsListElement.querySelector(`.films-list__title`);
  // Check if cards.length === 0 do not render them and change the title
  if (cards.length === 0) {
    siteFilmsListElement.replaceChild(new NoCardsComponent().getElement(), siteFilmsListTitleElement);
    return;
  }
  // Render LoadMoreButton
  const moreButtonComponent = new MoreButtonComponent();
  render(siteFilmsListElement, moreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  let showingCardsCount = CARDS_COUNT_ON_START;
  cards
  .slice(0, showingCardsCount)
  .forEach((card) => renderCard(siteFilmsListContainerElement, card));

  const removeMoreButton = () => {
    if (showingCardsCount >= CARDS_COUNT) {
      moreButtonComponent.getElement().remove();
      moreButtonComponent.removeElement();
    }
  };
    // Remove moreButton if at the start has less than 5 cards
  removeMoreButton();
  // Render cards and cards that showing `CARDS_COUNT_LOAD_MORE_BUTTON` cards by click show more button
  moreButtonComponent.getElement().addEventListener(`click`, () => {
    const showedCardsCount = showingCardsCount;
    showingCardsCount += CARDS_COUNT_LOAD_MORE_BUTTON;
    cards
    .slice(showedCardsCount, showingCardsCount)
    .forEach((card) => renderCard(siteFilmsListContainerElement, card));
    removeMoreButton();
  });
};
// Rendering topFilms and board function
const renderTopFilmsBoard = (topFilmsBoardElement, topRatedCards) => {
  const siteTopFilmsListContainer = topFilmsBoardElement.querySelector(`.films-list__container`);
  topRatedCards.forEach((card) => {
    renderCard(siteTopFilmsListContainer, card);
  });
};
// Rendering mostCommentedFilms and board function
const renderMostCommentedFilmsBoard = (mostCommentedFilmsBoardElement, mostCommentedCards) => {
  const siteMostCommentedFilmsListContainer = mostCommentedFilmsBoardElement.querySelector(`.films-list__container`);
  mostCommentedCards.forEach((card) => {
    renderCard(siteMostCommentedFilmsListContainer, card);
  });
};

// Variables
const cards = generateCards(CARDS_COUNT);
const navigationFilters = generateFilters(cards);
const topRatedCards = selectTopCards(cards);
const mostCommentedCards = selectMostCommentedCards(cards);
const watchedFilmsCount = navigationFilters[2].count;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
// Render profile, navigation(filters) and sorting menu
render(siteHeaderElement, new ProfileComponent(watchedFilmsCount).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationComponent(navigationFilters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

const filmsBoardComponent = new FilmsBoardComponent();
render(siteMainElement, filmsBoardComponent.getElement(), RenderPosition.BEFOREEND);
// Render main filmsList with cards
renderFilmsBoard(filmsBoardComponent.getElement(), cards);

const siteFilmsElement = siteMainElement.querySelector(`.films`);

// if topRatedCards or mostCommentedCards === 0 => do not render them
if (topRatedCards.length > 0) {
  const topFilmsBoardComponent = new TopFilmsBoardComponent();
  render(siteFilmsElement, topFilmsBoardComponent.getElement(), RenderPosition.BEFOREEND);
  renderTopFilmsBoard(topFilmsBoardComponent.getElement(), topRatedCards);
}

if (mostCommentedCards.length > 0) {
  const mostCommentedFilmsBoardComponent = new MostCommentedFilmsBoardComponent();
  render(siteFilmsElement, mostCommentedFilmsBoardComponent.getElement(), RenderPosition.BEFOREEND);
  renderMostCommentedFilmsBoard(mostCommentedFilmsBoardComponent.getElement(), mostCommentedCards);
}
// Render count of all movies
const siteCountStatisticsContainer = document.querySelector(`.footer__statistics`);
render(siteCountStatisticsContainer, new FilmsCountComponent(cards.length).getElement(), RenderPosition.BEFOREEND);
