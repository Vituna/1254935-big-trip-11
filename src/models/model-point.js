
export default class ModelEvent {
  constructor(data) {
    this.id = data[`id`] || ``;
    this.type = data[`type`];
    this.destination = {
      city: data[`destination`][`name`],
      description: data[`destination`][`description`],
      pictures: data[`destination`][`pictures`].map((it) => {
        return {
          url: it[`src`],
          alt: it[`description`],
        };
      }),
    };
    this.price = data[`base_price`];
    this.start = new Date(data[`date_from`]);
    this.end = new Date(data[`date_to`]);
    this.offers = data[`offers`];
    this.isFavorite = data[`is_favorite`];
  }
  static parseEvent(data) {
    return new ModelEvent(data);
  }
  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }

  static toRAW(data) {
    return {
      'id': data.id,
      'type': data.type,

      'destination': {
        'name': data.destination.city,
        'description': data.destination.description,
        'pictures': data.destination.pictures.map((it) => {
          return {
            'src': it[`url`],
            'description': it[`alt`],
          };
        }),
      },
      'base_price': data.price,
      'date_from': data.start,
      'date_to': data.end,
      'offers': data.offers,
      'is_favorite': data.isFavorite
    };
  }
}
