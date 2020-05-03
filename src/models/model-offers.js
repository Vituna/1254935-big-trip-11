export default class ModelOffers {
  constructor(data) {
    this.offers = data[`offers`];
  }
  static parseOffer(data) {
    return new ModelOffers(data);
  }
  static parseOffers(data) {
    return data.map(ModelOffers.parseOffer);
  }
}
