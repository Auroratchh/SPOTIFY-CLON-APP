import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyAlbumResponse } from '../../interfaces/spotify-api/spotify-album-response';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Album } from '../../interfaces/album';
import { Track } from '../../interfaces/track';
import { Image } from '../../interfaces/image';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAlbumService {

  constructor(
    private _http:HttpClient
  ){}

  getAlbum(id: string): Observable<Album>{
    return this._http.get<SpotifyAlbumResponse>(
      `${environment.API_URL}/albums/${id}`
    ).pipe(
      map(
        apiresponse => {

          const mappedTracks: Track[] = apiresponse.tracks.items.map(
            track => ({
              id: track.id,
              name: track.name,
              duration_ms: track.duration_ms,
              href: track.href,
              artists: track.artists.map(artist => ({
                id: artist.id,
                name: artist.name
              }))
            })
          );

          const mappedImages: Image[] = apiresponse.images.map(
            image => ({
              width: image.width,
              heigth: image.heigth,
              url: image.url
            })
          );

          return {
            id: apiresponse.id,
            name: apiresponse.name,
            total_tracks: apiresponse.total_tracks,
            images: mappedImages,
            href: apiresponse.href,
            tracks: mappedTracks,
          }
        }
      )
    )
  }
  
}
