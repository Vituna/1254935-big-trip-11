import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createSiteRouteInformation} from "./components/route.js";
import {createSiteCostTravel} from "./components/cost.js";
import {createCreateFormTemplate} from "./components/create.js";
import {createRoutePointTemplate} from "./components/point.js";

const TASK_COUNT = 3;

const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.page-header`);

const siteRouteElement = siteHeaderElement.querySelector(`.trip-main`);
render(siteRouteElement, createSiteRouteInformation(), `afterBegin`);

const siteCostElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);
render(siteCostElement, createSiteCostTravel());

const siteMenuElement = siteHeaderElement.querySelector(`.visually-hidden`);
render(siteMenuElement, createSiteMenuTemplate(), `afterEnd`);

const siteFilterElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
render(siteFilterElement, createFilterTemplate());

const siteMainElement = document.querySelector(`.page-body__page-main`);

const siteSortingElement = siteMainElement.querySelector(`.trip-events`);
render(siteSortingElement, createSortingTemplate());
render(siteSortingElement, createCreateFormTemplate());

for (let i = 0; i < TASK_COUNT; i++) {
  render(siteSortingElement, createRoutePointTemplate());
}

