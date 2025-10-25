import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface SpotifySearchResponse {
  tracks: {
    items: Array<{
      id: string;
      name: string;
      duration_ms: number;
      href: string;
      preview_url: string | null; 
      artists: Array<{
        id: string;
        name: string;
      }>;
      album: {
        id: string;
        name: string;
        images: Array<{
          url: string;
          height: number;
          width: number;
        }>;
      };
    }>;
  };
  albums: {
    items: Array<{
      id: string;
      name: string;
      images: Array<{
        url: string;
        height: number;
        width: number;
      }>;
      artists: Array<{
        id: string;
        name: string;
      }>;
      total_tracks: number;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SpotifySearchService {

  constructor(private _http: HttpClient) {}

  doSearch(query: string): Observable<SpotifySearchResponse> {
    const encodedQuery = encodeURIComponent(query);
    
    return this._http.get<SpotifySearchResponse>(
      `${environment.API_URL}/search?q=${encodedQuery}&type=track,album&limit=15`
    );
  }
}