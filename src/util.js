
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


