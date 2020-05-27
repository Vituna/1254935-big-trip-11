import {createTripInfo} from "./trip-info";
import {createTripCost} from "./trip-cost";
import AbstractComponent from "./abstract-component";

const createHeaderInfo = (points) => {

  return (
    `<section class="trip-main__trip-info  trip-info">
        ${createTripInfo(points)}
        ${createTripCost(points)}
     </section>`
  );
};

class Route extends AbstractComponent {
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;
  }

  getTemplate() {

    return createHeaderInfo(this._pointsModel.getPoints());
  }
}

export default Route;


