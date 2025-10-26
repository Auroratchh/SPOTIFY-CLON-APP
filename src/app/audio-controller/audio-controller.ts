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
  private currentTrackId?: string;
  private audioReady: boolean = false;

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
      if (this.audioPlayer && this.audioReady) {
        const audio = this.audioPlayer.nativeElement;
        if (playing) {
          audio.play().catch(e => {
            console.error('Error playing:', e);
            this.audioReady = false;
          });
        } else {
          audio.pause();
        }
      }
    });

    this.playbackSubscription = this._musicPlayer.currentPlayback$.subscribe(playback => {
      if (playback && this.audioPlayer) {
        const audio = this.audioPlayer.nativeElement;
        const isNewTrack = this.currentTrackId !== playback.track.id;
        
        if (isNewTrack && playback.track.preview_url) {
          console.log('ðŸŽµ Cargando:', playback.track.name);
          this.currentTrackId = playback.track.id;
          this.audioReady = false;
          
          // Pausar y limpiar audio anterior
          audio.pause();
          audio.currentTime = 0;
          
          // Cargar nueva canciÃ³n
          audio.src = playback.track.preview_url;
          audio.volume = this.volume / 100;
          audio.load();
          
        } else if (!playback.track.preview_url) {
          console.warn('âš ï¸ Sin preview disponible');
          setTimeout(() => this._musicPlayer.playNext(), 500);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    const audio = this.audioPlayer.nativeElement;
    
    audio.addEventListener('loadedmetadata', () => {
      this.duration = this.formatTime(audio.duration);
      console.log('âœ… DuraciÃ³n:', this.duration);
    });

    audio.addEventListener('canplaythrough', () => {
      this.audioReady = true;
      console.log('âœ… Audio listo para reproducir');
      
      if (this.isPlaying) {
        audio.play().catch(e => {
          console.error('Error en autoplay:', e);
          this.audioReady = false;
        });
      }
    });

    audio.addEventListener('ended', () => {
      console.log('ðŸ”š CanciÃ³n terminada');
      this.onTrackEnded();
    });

    audio.addEventListener('error', (e) => {
      console.error('âŒ Error de audio:', e);
      this.audioReady = false;
      setTimeout(() => this._musicPlayer.playNext(), 1000);
    });

    this.updateInterval = setInterval(() => {
      if (audio && !isNaN(audio.duration) && audio.duration > 0) {
        this.currentTime = this.formatTime(audio.currentTime);

        if (this.controlBar) {
          const progress = (audio.currentTime / audio.duration) * 100;
          this.controlBar.nativeElement.value = progress.toString();
        }
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.playbackSubscription?.unsubscribe();
    this.isPlayingSubscription?.unsubscribe();
    this.shuffleSubscription?.unsubscribe();
    this.repeatSubscription?.unsubscribe();
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    if (this.audioPlayer) {
      const audio = this.audioPlayer.nativeElement;
      audio.pause();
      audio.src = '';
    }
  }

  onTrackEnded() {
    if (this.repeatMode === 'one') {
      const audio = this.audioPlayer.nativeElement;
      audio.currentTime = 0;
      audio.play().catch(e => console.error('Error al repetir:', e));
    } else {
      this._musicPlayer.playNext();
    }
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
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
    if (audio && !isNaN(audio.duration) && audio.duration > 0) {
      audio.currentTime = (value / 100) * audio.duration;
    }
  }
}