class Point {
  constructor(data) {
    this.basePrice = data[`base_price`];
    this.timeStart = new Date(data[`date_from`]);
    this.timeEnd = new Date(data[`date_to`]);
    this.destinations = data[`destination`];
    this.id = data[`id`];
    this.isFavorite = data[`is_favorite`];
    this.offers = data[`offers`];
    this.type = data[`type`];
  }

  toRAW() {
    return {
      "base_price": this.basePrice,
      "date_from": this.timeStart.toISOString(),
      "date_to": this.timeEnd.toISOString(),
      "destination": this.destinations,
      "id": this.id,
      "is_favorite": this.isFavorite,
      "offers": this.offers,
      "type": this.type
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}

export default Point;
