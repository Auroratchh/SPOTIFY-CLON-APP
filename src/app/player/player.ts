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

  currentTrack: Track | undefined;
  currentCover: Image | undefined;
  playlist: Track[] = [];
  albumName: string = '';
  
  private playbackSubscription?: Subscription;

  constructor(
    private _musicPlayer: MusicPlayerService
  ) {}

  ngOnInit(): void {

    this.playbackSubscription = this._musicPlayer.currentPlayback$.subscribe(playback => {
      if (playback) {
        this.currentTrack = playback.track;

        this.currentCover = playback.track.albumImage || playback.cover;
        this.playlist = playback.playlist;
        this.albumName = playback.albumName || 'Playlist';
      }
    });
  }

  ngOnDestroy(): void {
    this.playbackSubscription?.unsubscribe();
  }


  onTrackClick(track: Track): void {

    const trackCover: Image = track.albumImage || this.currentCover || {
      width: 640,
      heigth: 640,
      url: ''
    };
    
    this._musicPlayer.setCurrentTrack(track, trackCover, this.playlist, this.albumName);
  }
}