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

  /**
   * FUNCIÃ“N MEJORADA: Ahora reordena la playlist correctamente
   */
  setCurrentTrack(track: Track, cover: Image, playlist: Track[], albumName?: string) {
    // Guardar playlist original
    this.originalPlaylist = [...playlist];
    
    // Encontrar el Ã­ndice de la canciÃ³n seleccionada
    const selectedIndex = playlist.findIndex(t => t.id === track.id);
    
    // Reordenar la playlist: la canciÃ³n seleccionada va primero, luego las siguientes
    let reorderedPlaylist: Track[];
    
    if (selectedIndex !== -1) {
      // Crear nueva playlist empezando desde la canciÃ³n seleccionada
      reorderedPlaylist = [
        ...playlist.slice(selectedIndex),  // Desde la seleccionada hasta el final
        ...playlist.slice(0, selectedIndex) // Desde el inicio hasta antes de la seleccionada
      ];
    } else {
      reorderedPlaylist = [...playlist];
    }

    // Si shuffle estÃ¡ activo, usar la playlist mezclada
    const finalPlaylist = this.isShuffleSubject.value ? this.shuffledPlaylist : reorderedPlaylist;
    
    const playback: CurrentPlayback = {
      track,
      cover,
      playlist: finalPlaylist,
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
      // Crear playlist mezclada excluyendo la canciÃ³n actual
      const otherTracks = this.originalPlaylist.filter(t => t.id !== current.track.id);
      this.shuffledPlaylist = [current.track, ...this.shuffleArray(otherTracks)];
      current.playlist = this.shuffledPlaylist;
    } else {
      // Volver a la playlist original reordenada desde la canciÃ³n actual
      const currentIndex = this.originalPlaylist.findIndex(t => t.id === current.track.id);
      if (currentIndex !== -1) {
        current.playlist = [
          ...this.originalPlaylist.slice(currentIndex),
          ...this.originalPlaylist.slice(0, currentIndex)
        ];
      } else {
        current.playlist = this.originalPlaylist;
      }
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
      // Reiniciar la misma canciÃ³n
      this.isPlayingSubject.next(false);
      setTimeout(() => this.isPlayingSubject.next(true), 50);
      return;
    }

    // La canciÃ³n actual siempre es la primera en la playlist reordenada
    if (current.playlist.length > 1) {
      // Siguiente canciÃ³n (Ã­ndice 1)
      const nextTrack = current.playlist[1];
      const nextCover = nextTrack.albumImage || current.cover;
      this.setCurrentTrack(nextTrack, nextCover, current.playlist, current.albumName);
    } else if (repeatMode === 'all' && current.playlist.length > 0) {
      // Si solo hay una canciÃ³n y repeat all estÃ¡ activo, repetirla
      const firstTrack = current.playlist[0];
      const firstCover = firstTrack.albumImage || current.cover;
      this.setCurrentTrack(firstTrack, firstCover, current.playlist, current.albumName);
    }
  }

  playPrevious() {
    const current = this.currentPlaybackSubject.value;
    if (!current || current.playlist.length === 0) return;

    // Buscar la canciÃ³n actual en la playlist original
    const currentIndexInOriginal = this.originalPlaylist.findIndex(t => t.id === current.track.id);
    
    if (currentIndexInOriginal > 0) {
      // Ir a la canciÃ³n anterior en la lista original
      const prevTrack = this.originalPlaylist[currentIndexInOriginal - 1];
      const prevCover = prevTrack.albumImage || current.cover;
      this.setCurrentTrack(prevTrack, prevCover, this.originalPlaylist, current.albumName);
    } else if (currentIndexInOriginal === 0) {
      // Si estamos en la primera, ir a la Ãºltima (comportamiento circular)
      const lastTrack = this.originalPlaylist[this.originalPlaylist.length - 1];
      const lastCover = lastTrack.albumImage || current.cover;
      this.setCurrentTrack(lastTrack, lastCover, this.originalPlaylist, current.albumName);
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