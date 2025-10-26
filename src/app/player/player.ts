import { Component, OnInit, OnDestroy } from '@angular/core';
import { MusicPlayerService } from '../services/general/music-player.service';
import { Track } from '../interfaces/track';
import { Image } from '../interfaces/image';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit, OnDestroy {
  
  currentTrack?: Track;
  currentCover?: Image;
  playlist: Track[] = [];
  
  private playbackSubscription?: Subscription;

  constructor(private _musicPlayer: MusicPlayerService) {}

  ngOnInit(): void {
    this.playbackSubscription = this._musicPlayer.currentPlayback$.subscribe(playback => {
      if (playback) {
        console.log('📻 Playback recibido:', playback);
        this.currentTrack = playback.track;
        this.currentCover = playback.cover;
        this.playlist = playback.playlist;
        
        // ✅ DEBUG: Imprime valores
        console.log('Track:', this.currentTrack?.name);
        console.log('Cover:', this.currentCover?.url);
        console.log('Playlist length:', this.playlist.length);
      }
    });
  }

  ngOnDestroy(): void {
    this.playbackSubscription?.unsubscribe();
  }

  onTrackClick(track: Track): void {
    if (this.currentCover && this.playlist.length > 0) {
      const trackCover = track.albumImage || this.currentCover;
      this._musicPlayer.setCurrentTrack(track, trackCover, this.playlist);
    }
  }
}