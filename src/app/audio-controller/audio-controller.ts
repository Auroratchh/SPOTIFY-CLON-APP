import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MusicPlayerService } from '../services/general/music-player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audio-controller',
  standalone: false,
  templateUrl: './audio-controller.html',
  styleUrl: './audio-controller.css'
})
export class AudioController implements OnInit, OnDestroy {
  
  @ViewChild('controlBar') controlBar!: ElementRef<HTMLInputElement>;
  
  isPlaying: boolean = false;
  currentTime: string = '0:00';
  duration: string = '0:00';
  volume: number = 70;
  isShuffle: boolean = false;
  repeatMode: 'off' | 'all' | 'one' = 'off';

  private playbackSubscription?: Subscription;
  private isPlayingSubscription?: Subscription;
  private shuffleSubscription?: Subscription;
  private repeatSubscription?: Subscription;
  private simulatedProgress: number = 0;
  private progressInterval?: any;
  private trackDurationMs: number = 0;

  constructor(private _musicPlayer: MusicPlayerService) {}

  ngOnInit(): void {
    this.shuffleSubscription = this._musicPlayer.isShuffle$.subscribe(shuffle => {
      this.isShuffle = shuffle;
      console.log('Shuffle:', shuffle);
    });

    this.repeatSubscription = this._musicPlayer.repeatMode$.subscribe(mode => {
      this.repeatMode = mode;
      console.log('Repeat:', mode);
    });

    this.isPlayingSubscription = this._musicPlayer.isPlaying$.subscribe(playing => {
      this.isPlaying = playing;
      console.log('Estado:', playing ? 'Playing' : 'Paused');
    });

    this.playbackSubscription = this._musicPlayer.currentPlayback$.subscribe(playback => {
      if (playback) {
        console.log('Canción actual:', playback.track.name);
        
        const durationInSeconds = playback.track.duration_ms / 1000;
        this.duration = this.formatTime(durationInSeconds);
        console.log('Duración:', this.duration);
      }
    });
  }

  ngOnDestroy(): void {
    this.playbackSubscription?.unsubscribe();
    this.isPlayingSubscription?.unsubscribe();
    this.shuffleSubscription?.unsubscribe();
    this.repeatSubscription?.unsubscribe();
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  togglePlay() {
    console.log('Toggle play');
    this._musicPlayer.togglePlay();
  }

  playNext() {
    console.log('Siguiente canción');
    this._musicPlayer.playNext();
  }

  playPrevious() {
    console.log('Canción anterior');
    this._musicPlayer.playPrevious();
  }

  toggleShuffle() {
    console.log('Toggle shuffle');
    this._musicPlayer.toggleShuffle();
  }

  toggleRepeat() {
    console.log('Toggle repeat');
    this._musicPlayer.toggleRepeat();
  }

  changeVolume(event: Event) {
    const target = event.target as HTMLInputElement;
    this.volume = parseInt(target.value);
    console.log('Volumen:', this.volume);
  }

  seekTo(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    console.log('Seek to:', value + '%');
  }
}