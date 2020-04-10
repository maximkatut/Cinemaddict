import {formatDate} from "../utils.js";

const createPopupInfoMarkup = (card) => {
  const {name, originalName, rating, director, writers, actors, releaseDate, ageRating, duration, genre, poster, country, description} = card;
  const formatReleaseDate = formatDate(releaseDate);

  const createPopupGenreMarkup = (it) => {
    return `<span class="film-details__genre">${it}</span>`;
  };

  const genresMarkup = genre.map((it) => {
    return createPopupGenreMarkup(it);
  }).join(``);

  return (`
  <div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="${poster}" alt="">

      <p class="film-details__age">${ageRating}</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${name}</h3>
          <p class="film-details__title-original">Original: ${originalName}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${rating}</p>
        </div>
      </div>

      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${writers.join(`, `)}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${actors.join(`, `)}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${formatReleaseDate}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">${duration}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${country}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
          <td class="film-details__cell">
          ${genresMarkup}
        </tr>
      </table>

      <p class="film-details__film-description">
        ${description}
      </p>
    </div>
  </div>`);
};

export const createPopupInfoTemplate = (card) => {
  return createPopupInfoMarkup(card);
};
