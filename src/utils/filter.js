export const getAllPoints = (points) => points;

export const getFuturePoints = (points, date) => {
  return points.filter((point) => date < point.timeStart);
};

export const getPastPoints = (points, date) => {
  return points.filter((point) => date > point.timeStart);
};

const pointsByFilter = {
  everything: getAllPoints,
  future: getFuturePoints,
  past: getPastPoints
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  return pointsByFilter[filterType](points, nowDate);
};
