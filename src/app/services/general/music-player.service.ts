import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track } from '../../interfaces/track';
import { Image } from '../../interfaces/image';

export interface CurrentPlayback {
  track: Track;
  cover: Image;
  playlist: Track[];
  albumName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {

  private currentPlaybackSubject = new BehaviorSubject<CurrentPlayback | null>(null);
  public currentPlayback$: Observable<CurrentPlayback | null> = this.currentPlaybackSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();

  private isShuffleSubject = new BehaviorSubject<boolean>(false);
  public isShuffle$: Observable<boolean> = this.isShuffleSubject.asObservable();

  private repeatModeSubject = new BehaviorSubject<'off' | 'all' | 'one'>('off');
  public repeatMode$: Observable<'off' | 'all' | 'one'> = this.repeatModeSubject.asObservable();

  private originalPlaylist: Track[] = [];
  private shuffledPlaylist: Track[] = [];

  constructor() {}


  setCurrentTrack(track: Track, cover: Image, playlist: Track[], albumName?: string) {
 
    this.originalPlaylist = [...playlist];
    
    const playback: CurrentPlayback = {
      track,
      cover,
      playlist: this.isShuffleSubject.value ? this.shuffledPlaylist : playlist,
      albumName
    };
    
    this.currentPlaybackSubject.next(playback);
    this.isPlayingSubject.next(true);
  }


  getCurrentPlayback(): CurrentPlayback | null {
    return this.currentPlaybackSubject.value;
  }


  togglePlay() {
    this.isPlayingSubject.next(!this.isPlayingSubject.value);
  }

  toggleShuffle() {
    const newShuffleState = !this.isShuffleSubject.value;
    this.isShuffleSubject.next(newShuffleState);

    const current = this.currentPlaybackSubject.value;
    if (!current) return;

    if (newShuffleState) {
 
      this.shuffledPlaylist = this.shuffleArray([...this.originalPlaylist]);
  
      const currentIndex = this.shuffledPlaylist.findIndex(t => t.id === current.track.id);
      if (currentIndex > 0) {
        const [currentTrack] = this.shuffledPlaylist.splice(currentIndex, 1);
        this.shuffledPlaylist.unshift(currentTrack);
      }
      current.playlist = this.shuffledPlaylist;
    } else {
     
      current.playlist = this.originalPlaylist;
    }

    this.currentPlaybackSubject.next({...current});
  }

  toggleRepeat() {
    const current = this.repeatModeSubject.value;
    let newMode: 'off' | 'all' | 'one';
    
    if (current === 'off') {
      newMode = 'all';
    } else if (current === 'all') {
      newMode = 'one';
    } else {
      newMode = 'off';
    }
    
    this.repeatModeSubject.next(newMode);
  }

  playNext() {
    const current = this.currentPlaybackSubject.value;
    if (!current) return;

    const repeatMode = this.repeatModeSubject.value;
    
    if (repeatMode === 'one') {
      this.isPlayingSubject.next(false);
      setTimeout(() => this.isPlayingSubject.next(true), 50);
      return;
    }

    const currentIndex = current.playlist.findIndex(t => t.id === current.track.id);
    
    if (currentIndex < current.playlist.length - 1) {

      const nextTrack = current.playlist[currentIndex + 1];
      const nextCover = nextTrack.albumImage || current.cover;
      this.setCurrentTrack(nextTrack, nextCover, current.playlist, current.albumName);
    } else if (repeatMode === 'all') {

      const firstTrack = current.playlist[0];
      const firstCover = firstTrack.albumImage || current.cover;
      this.setCurrentTrack(firstTrack, firstCover, current.playlist, current.albumName);
    }
  }

  playPrevious() {
    const current = this.currentPlaybackSubject.value;
    if (!current) return;

    const currentIndex = current.playlist.findIndex(t => t.id === current.track.id);
    if (currentIndex > 0) {
      const prevTrack = current.playlist[currentIndex - 1];
      const prevCover = prevTrack.albumImage || current.cover;
      this.setCurrentTrack(prevTrack, prevCover, current.playlist, current.albumName);
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}