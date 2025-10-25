import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MusicPlayerService } from '../services/general/music-player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audio-controller',
  standalone: false,
  templateUrl: './audio-controller.html',
  styleUrl: './audio-controller.css'
})
export class AudioController implements OnInit, OnDestroy, AfterViewInit {
  
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
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
  private updateInterval?: any;

  constructor(private _musicPlayer: MusicPlayerService) {}

  ngOnInit(): void {
    this.shuffleSubscription = this._musicPlayer.isShuffle$.subscribe(shuffle => {
      this.isShuffle = shuffle;
    });

    this.repeatSubscription = this._musicPlayer.repeatMode$.subscribe(mode => {
      this.repeatMode = mode;
    });

    this.isPlayingSubscription = this._musicPlayer.isPlaying$.subscribe(playing => {
      this.isPlaying = playing;
      if (this.audioPlayer) {
        if (playing) {
          this.audioPlayer.nativeElement.play().catch(e => console.error('Error playing:', e));
        } else {
          this.audioPlayer.nativeElement.pause();
        }
      }
    });


    this.playbackSubscription = this._musicPlayer.currentPlayback$.subscribe(playback => {
      if (playback && this.audioPlayer) {
        const audio = this.audioPlayer.nativeElement;
        
        if (playback.track.preview_url) {
          audio.src = playback.track.preview_url;
          audio.volume = this.volume / 100;
        
          audio.addEventListener('loadedmetadata', () => {
            this.duration = this.formatTime(audio.duration);
            if (this.isPlaying) {
              audio.play().catch(e => console.error('Error playing:', e));
            }
          });

          audio.addEventListener('ended', () => {
            this.onTrackEnded();
          });

        } else {
          console.warn('Esta canción no tiene preview disponible');
        }
      }
    });
  }

  ngAfterViewInit(): void {

    const audio = this.audioPlayer.nativeElement;
  
    this.updateInterval = setInterval(() => {
      if (audio && !isNaN(audio.duration)) {
        this.currentTime = this.formatTime(audio.currentTime);

        if (this.controlBar) {
          const progress = (audio.currentTime / audio.duration) * 100;
          this.controlBar.nativeElement.value = progress.toString();
        }
      }
    }, 1000);


    if (this.controlBar) {
      this.controlBar.nativeElement.addEventListener('input', (e: any) => {
        const value = parseFloat(e.target.value);
        const audio = this.audioPlayer.nativeElement;
        if (audio && !isNaN(audio.duration)) {
          audio.currentTime = (value / 100) * audio.duration;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.playbackSubscription?.unsubscribe();
    this.isPlayingSubscription?.unsubscribe();
    this.shuffleSubscription?.unsubscribe();
    this.repeatSubscription?.unsubscribe();
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }


  onTrackEnded() {
    const repeatMode = this.repeatMode;
    
    if (repeatMode === 'one') {
   
      const audio = this.audioPlayer.nativeElement;
      audio.currentTime = 0;
      audio.play();
    } else {

      this._musicPlayer.playNext();
    }
  }


  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  togglePlay() {
    this._musicPlayer.togglePlay();
  }

  playNext() {
    this._musicPlayer.playNext();
  }

  playPrevious() {
    this._musicPlayer.playPrevious();
  }

  toggleShuffle() {
    this._musicPlayer.toggleShuffle();
  }

  toggleRepeat() {
    this._musicPlayer.toggleRepeat();
  }

  changeVolume(event: Event) {
    const target = event.target as HTMLInputElement;
    this.volume = parseInt(target.value);
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.volume = this.volume / 100;
    }
  }

 
  seekTo(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    const audio = this.audioPlayer.nativeElement;
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = (value / 100) * audio.duration;
    }
  }
}