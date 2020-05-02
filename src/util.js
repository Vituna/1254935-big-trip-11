const TIME_IN_MS = 60 * 60 * 24 * 1000;

export const getRandomElement = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

export const getRandomArray = (min, max, array) => {
  const newArray = [];
  const newArrayLength = getRandomInteger(min, max);
  for (let i = 0; i < newArrayLength; i++) {
    newArray.push(getRandomElement(array));
  }
  return newArray;
};

export const getArray = (min, max) => {
  const newArray = [];
  const newArrayLength = getRandomInteger(min, max);
  for (let i = 0; i < newArrayLength; i++) {
    newArray.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return newArray;
};

export const getRandomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

export const getRandomDate = (days) => {
  return Date.now() + (getRandomInteger(0, (days * 24))) * TIME_IN_MS / 24;
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
