export default class Card {
  constructor(data) {
    this.id = data[`id`];
    this.description = data[`description`] || ``;
  }

  static parseCard(data) {
    return new Card(data);
  }

  static parseCards(data) {
    return data.map(Card.parseCard);
  }
}
