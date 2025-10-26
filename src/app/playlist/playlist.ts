import { Component, input, output, computed } from '@angular/core';
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
  currentTrack = input<Track | undefined>();

  trackSelected = output<Track>();

  rotatedPlaylist = computed(() => {
    const tracks = this.playlist();
    const current = this.currentTrack();
    
    if (!tracks || tracks.length === 0 || !current) {
      return tracks || [];
    }

    const currentIndex = tracks.findIndex(t => t.id === current.id);
    
    if (currentIndex === -1) {
      return tracks;
    }

    return [
      ...tracks.slice(currentIndex),  
      ...tracks.slice(0, currentIndex) 
    ];
  });

  onTrackClick(track: Track): void {
    this.trackSelected.emit(track);
  }

  getTrackCover(track: Track): Image | undefined {
    if (track.albumImage) {
      return track.albumImage;
    }
    return this.cover();
  }

  isCurrentTrack(track: Track): boolean {
    const current = this.currentTrack();
    return current ? current.id === track.id : false;
  }
}