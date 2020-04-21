import AbstractComponent from "./abstract-component.js";

export default class SortContainer extends AbstractComponent {

  getTemplate() {
    return `<li class="trip-days__item  day">
    <div class="day__info">
     </div>
    <ul class="trip-events__list">
    </ul>
    </li>`;
  }
}
