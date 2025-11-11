import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SpotifyLoginService {
  
  constructor(
    private _http:HttpClient
  ){  }

  getAccessToken(): Observable<any> {

    const body = new HttpParams()
      .set('grant_type','client_credentials')
      .set('client_id',environment.CLIENT_ID)
      .set('client_secret',environment.CLIENT_SECRET);

    return this._http.post<any>(
      environment.AUTH_API_URL,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  }

}
