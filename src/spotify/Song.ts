export class Song {
  public name: string;
  public artist: string;
  public progress_ms: number;
  public is_playing: boolean;

  constructor(
    name: string,
    artist: string,
    progress_ms: number,
    is_playing: boolean
  ) {
    this.name = name;
    this.artist = artist;
    this.progress_ms = progress_ms;
    this.is_playing = is_playing;
  }

  details() {
    return `${this.name} [${this.artist}]`;
  }

  progressBar() {
    const progressBarLength = 20;
    const progressPercent = (this.progress_ms / 300000) * 100;
    const progressBar = Math.round((progressPercent * progressBarLength) / 100);
    const emptyProgressBar = progressBarLength - progressBar;
    return `${"▬".repeat(progressBar)}🔘${"▬".repeat(emptyProgressBar)}`;
  }
}
