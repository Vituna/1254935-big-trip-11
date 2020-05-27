import {getDurationMinutes} from "./common";
import {Format} from "../components/consts";

const getMoneyByType = (type, events) => {
  let total = 0;

  events.forEach((event) => {
    if (event.type === type) {
      total += event.basePrice;
    }
  });

  return total;
};

const getCountByType = (type, events) => {
  let total = 0;

  events.forEach((event) => {
    if (event.type === type) {
      total++;
    }
  });

  return total;
};

const getDurationByType = (type, events) => {
  let total = 0;

  events.forEach((event) => {
    if (event.type === type) {
      total += getDurationMinutes(event.timeStart, event.timeEnd);
    }
  });

  return total;
};

export const formatedDuration = (total) => {
  const hours = Math.floor(total / Format.IN_HOUR);
  const minutes = total % Format.IN_HOUR;

  const durationHours = hours > 0 ? `${hours}H` : ``;
  const durationMinutes = minutes > 0 ? `${minutes}M` : ``;

  if (durationHours) {
    return `${durationHours}`;
  }

  return `${durationMinutes}`;
};

export const getMoneyByTypes = (types, events) => {
  return types.map((type) => getMoneyByType(type, events));
};

export const getCountByTypes = (types, events) => {
  return types.map((type) => getCountByType(type, events));
};

export const getDurationByTypes = (types, events) => {
  return types.map((type) => getDurationByType(type, events));
};
