export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.content = data[`comment`];
    this.author = data[`author`];
    this.date = data[`date`];
    this.emoji = data[`emotion`];
  }

  toRAW() {
    return {
      "id": this.id,
      "author": this.author,
      "comment": this.content,
      "date": this.date,
      "emotion": this.emoji
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
