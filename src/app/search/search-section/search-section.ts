import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifySearchService } from '../../services/spotify-api/spotify-search-services';
import { SpotifyAlbumService } from '../../services/spotify-api/spotify-album-service';
import { MusicPlayerService } from '../../services/general/music-player.service';
import { Track } from '../../interfaces/track';
import { Image } from '../../interfaces/image';

@Component({
  selector: 'app-search-section',
  standalone: false,
  templateUrl: './search-section.html',
  styleUrl: './search-section.css'
})
export class SearchSection {
  
  searchResults: any = null;
  isLoading: boolean = false;
  hasSearched: boolean = false;

  constructor(
    private _spotifySearch: SpotifySearchService,
    private _spotifyAlbum: SpotifyAlbumService,
    private _musicPlayer: MusicPlayerService,
    private _router: Router
  ) {}

  onSearch(query: string) {
    if (!query || !query.trim()) {
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    
    this._spotifySearch.doSearch(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
        this.isLoading = false;
        this.searchResults = null;
      }
    });
  }

  playTrack(track: any) {
    console.log('PLAY TRACK');
    console.log('Track seleccionado:', track.name);
   
    const convertedTrack: Track = {
      id: track.id,
      name: track.name,
      duration_ms: track.duration_ms,
      href: track.href,
      preview_url: track.preview_url,
      artists: track.artists.map((artist: any) => ({
        id: artist.id,
        name: artist.name
      })),
      albumImage: {
        width: track.album?.images?.[0]?.width || 640,
        heigth: track.album?.images?.[0]?.height || 640,
        url: track.album?.images?.[0]?.url || ''
      }
    };

    const cover: Image = {
      width: track.album?.images?.[0]?.width || 640,
      heigth: track.album?.images?.[0]?.height || 640,
      url: track.album?.images?.[0]?.url || ''
    };

    const playlist: Track[] = this.searchResults.tracks.items
      .filter((t: any) => t.album?.images?.length > 0) 
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        duration_ms: t.duration_ms,
        href: t.href,
        preview_url: t.preview_url,
        artists: t.artists.map((artist: any) => ({
          id: artist.id,
          name: artist.name
        })),
        albumImage: {
          width: t.album?.images?.[0]?.width || 640,
          heigth: t.album?.images?.[0]?.height || 640,
          url: t.album?.images?.[0]?.url || ''
        }
      }));

    console.log('Playlist creada con', playlist.length, 'canciones');

    this._musicPlayer.setCurrentTrack(
      convertedTrack, 
      cover, 
      playlist, 
      `${track.artists[0]?.name || 'Artista'} - ${track.album?.name || 'Álbum'}`
    );

    this._router.navigate(['/']);
  }

  playAlbum(album: any) {
    console.log('PLAY ALBUM');
    console.log('Álbum seleccionado:', album.name);
    
    this.isLoading = true;

    this._spotifyAlbum.getAlbum(album.id).subscribe({
      next: (fullAlbum) => {
        console.log('Álbum cargado:', fullAlbum.name);
        console.log('Total de canciones:', fullAlbum.tracks.length);

        if (fullAlbum.tracks.length === 0) {
          console.warn('El álbum no tiene canciones');
          this.isLoading = false;
          return;
        }

        const albumCover: Image = fullAlbum.images[0] || {
          width: 640,
          heigth: 640,
          url: ''
        };

        const albumTracks: Track[] = fullAlbum.tracks.map(track => ({
          ...track,
          albumImage: albumCover
        }));

        const firstTrack = albumTracks[0];

        this._musicPlayer.setCurrentTrack(
          firstTrack,
          albumCover,
          albumTracks,
          `${album.artists[0]?.name || 'Artista'} - ${fullAlbum.name}`
        );

        this.isLoading = false;
        this._router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al cargar álbum:', error);
        this.isLoading = false;
      }
    });
  }
}