import { Component, input, output } from '@angular/core';
import { Track } from '../interfaces/track';
import { Image } from '../interfaces/image';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})
export class Playlist {

  playlist = input.required<Track[] | undefined>();
  cover = input.required<Image | undefined>();

  trackSelected = output<Track>();

  onTrackClick(track: Track): void {
    this.trackSelected.emit(track);
  }

  getTrackCover(track: Track): Image | undefined {
  
    if (track.albumImage) {
      return track.albumImage;
    }
    
    return this.cover();
  }
}