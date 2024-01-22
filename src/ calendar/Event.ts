import moment from "moment";

export class Event {
  public name: string;
  public start_time?: Date;
  public end_time?: Date;
  constructor(name: string, start_time?: Date, end_time?: Date) {
    this.name = name;
    this.start_time = start_time;
    this.end_time = end_time;
  }

  details() {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    if (!this.start_time) {
      return `${this.name}`;
    }

    const startTimeString = this.start_time.toLocaleTimeString(
      "en-US",
      options
    );

    if (!this.end_time) {
      return `${this.name} [${startTimeString}]`;
    }

    const endTimeString = this.end_time.toLocaleTimeString("en-US", options);
    return `${this.name} [${startTimeString} - ${endTimeString}]`;
  }
}
