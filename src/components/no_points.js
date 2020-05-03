import AbstractComponent from "./abstract-component.js";
export default class Message extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}
