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
  private currentOrderPlaylist: Track[] = [];

  constructor() {}

  setCurrentTrack(track: Track, cover: Image, playlist: Track[], albumName?: string) {
    const uniquePlaylist = this.removeDuplicates(playlist);
    
   
    const isNewPlaylist = this.isPlaylistDifferent(uniquePlaylist);
    
    if (isNewPlaylist) {
      console.log('Nueva playlist detectada - reemplazando completamente');
      this.originalPlaylist = [...uniquePlaylist];
      
    
      if (this.isShuffleSubject.value) {
        this.currentOrderPlaylist = this.generateShuffledOrder(track, this.originalPlaylist);
      } else {
        this.currentOrderPlaylist = [...this.originalPlaylist];
      }
    } else {
     
      console.log(' Canción seleccionada de playlist existente');
    }

    const playback: CurrentPlayback = {
      track,
      cover,
      playlist: [...this.currentOrderPlaylist],
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
      
      this.currentOrderPlaylist = this.generateShuffledOrder(current.track, this.originalPlaylist);
      console.log('Shuffle activado:', this.currentOrderPlaylist.map(t => t.name));
    } else {
   
      this.currentOrderPlaylist = [...this.originalPlaylist];
      console.log('Orden original restaurado:', this.currentOrderPlaylist.map(t => t.name));
    }

    current.playlist = [...this.currentOrderPlaylist];
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
    console.log('Repeat mode:', newMode);
  }

  playNext() {
    const current = this.currentPlaybackSubject.value;
    if (!current || this.currentOrderPlaylist.length === 0) {
      console.warn('No hay playlist o está vacía');
      return;
    }

    const repeatMode = this.repeatModeSubject.value;
    
    if (repeatMode === 'one') {
      console.log('Repeat One activo - no avanzar');
      return;
    }

    const currentIndex = this.currentOrderPlaylist.findIndex(t => t.id === current.track.id);
    
    if (currentIndex === -1) {
      console.error('Canción actual no encontrada en playlist');
      console.log('Buscando:', current.track.id, current.track.name);
      console.log('En playlist:', this.currentOrderPlaylist.map(t => `${t.id}-${t.name}`));
      return;
    }

    console.log(`Next: índice actual ${currentIndex}/${this.currentOrderPlaylist.length - 1}`);
    
    if (currentIndex < this.currentOrderPlaylist.length - 1) {

      const nextTrack = this.currentOrderPlaylist[currentIndex + 1];
      const nextCover = nextTrack.albumImage || current.cover;
      
      console.log('Reproduciendo:', nextTrack.name);
      
      current.track = nextTrack;
      current.cover = nextCover;
      
      this.currentPlaybackSubject.next({...current});
      this.isPlayingSubject.next(true);
    } else if (repeatMode === 'all') {
    
      const firstTrack = this.currentOrderPlaylist[0];
      const firstCover = firstTrack.albumImage || current.cover;
      
      console.log('Repeat All: volviendo al inicio ->', firstTrack.name);
      
      current.track = firstTrack;
      current.cover = firstCover;
      
      this.currentPlaybackSubject.next({...current});
      this.isPlayingSubject.next(true);
    } else {
      
      console.log('Final de playlist - pausando');
      this.isPlayingSubject.next(false);
    }
  }

  
  playPrevious() {
    const current = this.currentPlaybackSubject.value;
    if (!current || this.currentOrderPlaylist.length === 0) {
      console.warn('No hay playlist o está vacía');
      return;
    }

    const currentIndex = this.currentOrderPlaylist.findIndex(t => t.id === current.track.id);
    
    if (currentIndex === -1) {
      console.error('Canción actual no encontrada en playlist');
      return;
    }

    console.log(`Previous: índice actual ${currentIndex}/${this.currentOrderPlaylist.length - 1}`);
    
    if (currentIndex > 0) {
     
      const prevTrack = this.currentOrderPlaylist[currentIndex - 1];
      const prevCover = prevTrack.albumImage || current.cover;
      
      console.log('Reproduciendo:', prevTrack.name);
      
      current.track = prevTrack;
      current.cover = prevCover;
      
      this.currentPlaybackSubject.next({...current});
      this.isPlayingSubject.next(true);
    } else {
      
      const lastTrack = this.currentOrderPlaylist[this.currentOrderPlaylist.length - 1];
      const lastCover = lastTrack.albumImage || current.cover;
      
      console.log('Circular: saltando a la última ->', lastTrack.name);
      
      current.track = lastTrack;
      current.cover = lastCover;
      
      this.currentPlaybackSubject.next({...current});
      this.isPlayingSubject.next(true);
    }
  }

 
  private generateShuffledOrder(currentTrack: Track, sourcePlaylist: Track[]): Track[] {
   
    const otherTracks = sourcePlaylist.filter(t => t.id !== currentTrack.id);

    for (let i = otherTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherTracks[i], otherTracks[j]] = [otherTracks[j], otherTracks[i]];
    }
    
    
    const result = [currentTrack, ...otherTracks];
    console.log('Orden shuffled generado:', result.map(t => t.name));
    return result;
  }

  private removeDuplicates(tracks: Track[]): Track[] {
    const seen = new Set<string>();
    const unique = tracks.filter(track => {
      if (seen.has(track.id)) {
        return false;
      }
      seen.add(track.id);
      return true;
    });
    
    if (unique.length < tracks.length) {
      console.log(`Eliminados ${tracks.length - unique.length} duplicados`);
    }
    
    return unique;
  }

  private isPlaylistDifferent(newPlaylist: Track[]): boolean {
  
    if (this.originalPlaylist.length === 0) {
      return true;
    }
    
    if (this.originalPlaylist.length !== newPlaylist.length) {
      return true;
    }
    
    const originalIds = new Set(this.originalPlaylist.map(t => t.id));
    const newIds = new Set(newPlaylist.map(t => t.id));
    
    for (const id of newIds) {
      if (!originalIds.has(id)) {
        return true;
      }
    }
 
    return false;
  }
}