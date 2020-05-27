const getOffersPrice = (offersPriceAll, offer) => {
  offersPriceAll += offer.price;

  return offersPriceAll;
};

const getAllPrice = (total, point) => {
  const offersPrice = point.offers.reduce(getOffersPrice, 0);

  total += point.basePrice + offersPrice;

  return total;
};

export const createTripCost = (points) => {
  const price = points.reduce(getAllPrice, 0);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>`
  );
};
