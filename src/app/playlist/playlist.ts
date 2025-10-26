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
  currentTrack = input<Track | undefined>(); // Nuevo: recibir la canciÃ³n actual

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

  // Nuevo: verificar si es la canciÃ³n actual
  isCurrentTrack(track: Track): boolean {
    const current = this.currentTrack();
    return current ? current.id === track.id : false;
  }
}