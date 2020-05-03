export default class ModelDestinations {
  constructor(data) {

    this.city = data[`name`];
    this.description = data[`description`];
    this.pictures = data[`pictures`].map((it) => {
      return {
        url: it[`src`],
        alt: it[`description`],
      };
    });
  }
  static parseDestination(data) {
    return new ModelDestinations(data);
  }
  static parseDestinations(data) {
    return data.map(ModelDestinations.parseDestination);
  }
}
