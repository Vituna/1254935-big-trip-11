import AbstractComponent from "./abstract-component";
import {TagName} from "../utils/consts";

const createMenu = () => {

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
       <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" id="table">Table</a>
       <a class="trip-tabs__btn" href="#" id="stats">Stats</a>
     </nav>`
  );
};

class SiteMenu extends AbstractComponent {
  getTemplate() {

    return createMenu();
  }

  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);
    this.getElement().querySelectorAll(`.trip-tabs__btn`)
      .forEach((btn) => btn.classList.remove(`trip-tabs__btn--active`));

    item.classList.add(`trip-tabs__btn--active`);
  }

  setOnChange(onMenuSwitch) {
    this.getElement().addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== TagName.A) {
        return;
      }

      const menuItem = evt.target.id;

      this.setActiveItem(menuItem);

      onMenuSwitch(menuItem);
    });
  }
}

export default SiteMenu;
