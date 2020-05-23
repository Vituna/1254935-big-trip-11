export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};


export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const RenderPosition = {
  PREPEND: `prepend`,
  APPEND: `append`,
};

export const render = (container, element, position) => {
  switch (position) {
    case RenderPosition.PREPEND:
      container.prepend(element);
      break;
    case RenderPosition.APPEND:
      container.append(element);
      break;
  }
};
export const remove = (element) => {
  if (element) {
    element.remove();
  }
};

export const getPrice = (eventsData) => {
  let price = 0;
  if (eventsData.length !== 0) {
    price = eventsData.map((event) => {
      const offersPrice = event.offers.filter((it) => it.accepted).reduce((a, b) => {
        return a + b.price;
      }, 0);
      return event.price + offersPrice;
    }).reduce((a, b) => a + b);
  }
  return price;
};

export const getEventsInDays = (eventsData) => {
  return eventsData.reduce((acc, event) => {
    const date = new Date(event.start).toDateString();
    if (acc[date]) {
      acc[date].push(event);
    } else {
      acc[date] = [event];
    }
    return acc;
  }, {});
};

export const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};
// const textDay = this._sort.getElement().querySelector(`.trip-sort__item--day`);


/* switch (currentSort) {
  case `sort-event`:
    this._renderDaysList(data);
    textDay.textContent = `Day`;
    break;
  case `sort-time`:
    const eventsByTime = data.slice().sort((a, b) => (a.start - a.end) - (b.start - b.end));
    this._renderEvents(eventsByTime, eventsListSort);
    textDay.textContent = ` `;
    break;
  case `sort-price`:
    const eventsByPrice = data.slice().sort((a, b) => b.price - a.price);
    this._renderEvents(eventsByPrice, eventsListSort);
    textDay.textContent = ` `;
    break;*/
