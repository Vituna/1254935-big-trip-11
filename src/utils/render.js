import {Place} from "../components/consts";

export const render = (container, component, place) => {
  switch (place) {
    case Place.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case Place.BEFOREEND:
      container.append(component.getElement());
      break;
    case Place.AFTERNODE:
      container.after(component.getElement());
      break;
    case Place.BEFORENODE:
      container.before(component.getElement());
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
