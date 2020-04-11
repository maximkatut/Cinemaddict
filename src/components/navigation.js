const createNavigationMarkup = (filter) => {
  const {name, count} = filter;
  return `<a href="#${name}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

export const createNavigationTemplate = (filters) => {
  const navigationMarkup = filters.map((it) => {
    return createNavigationMarkup(it);
  }).join(`\n`);
  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${navigationMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
};
