export class Notification {
  public text: string;
  public type: string;

  constructor(text: string, type: string) {
    this.text = text;
    this.type = type;
  }

  details() {
    return this.text;
  }
}
