import AbstractComponent from "./abstract-component";

const createEmptyDay = () => {

  return (
    `<li class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
     </li>`
  );
};

class SortBlock extends AbstractComponent {

  getTemplate() {

    return createEmptyDay();
  }
}

export default SortBlock;
