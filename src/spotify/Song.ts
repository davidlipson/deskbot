export class Song {
  public name: string;
  public artist: string;
  public progress_ms: number;
  public duration_ms: number;
  public is_playing: boolean;

  constructor(
    name: string,
    artist: string,
    progress_ms: number,
    is_playing: boolean,
    duration_ms: number
  ) {
    this.name = name;
    this.artist = artist;
    this.progress_ms = progress_ms;
    this.is_playing = is_playing;
    this.duration_ms = duration_ms;
  }

  progress(): number {
    return Math.round((this.progress_ms / this.duration_ms) * 100);
  }
}
