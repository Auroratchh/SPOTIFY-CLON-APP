import { Component, OnInit, signal } from '@angular/core';
import { SpotifyLoginService } from './services/spotify-api/spotify-login-service';
import { SpotifyAlbumService } from './services/spotify-api/spotify-album-service';
import { CookiesStorageService } from './services/general/cookies-storage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{

  constructor(
    private _spotifyLogin: SpotifyLoginService,
    private _cookieStorage: CookiesStorageService
  ){}

  ngOnInit(): void {
    if(!this._cookieStorage.exists('access_token') || !this._cookieStorage.isCookieValid('access_token'))
      this._spotifyLogin.getAccessToken().subscribe();
  }

}
