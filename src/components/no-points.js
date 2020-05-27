import AbstractComponent from "./abstract-component";

const createNoEvent = () => `<p class="trip-events__msg">Click New Event to create your first point</p>`;

class NoEvent extends AbstractComponent {
  getTemplate() {

    return createNoEvent();
  }
}

export default NoEvent;
