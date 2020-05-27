import AbstractComponent from "./abstract-component";

const createBoard = () => `<ul class="trip-days"></ul>`;

class PointDayAll extends AbstractComponent {
  getTemplate() {

    return createBoard();
  }
}

export default PointDayAll;

