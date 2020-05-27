import {isOnline} from "../api/provider";


export const createDestination = (destinations, isDestination) => {
  const {description, pictures} = destinations;

  if (!isOnline()) {
    isDestination = false;
  }

  if (isDestination && pictures.length > 0) {
    return (
      `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${createEventImages(pictures)}
    </section>`
    );
  } else {
    return ``;
  }
};

const createImg = (img) => `<img class="event__photo" src="${img.src}" alt="${img.description}">`;
const getImages = (pictures) => pictures.map((it) => createImg(it)).join(`\n`);

const createEventImages = (pictures) => {

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${getImages(pictures)}
      </div>
    </div>`
  );
};
