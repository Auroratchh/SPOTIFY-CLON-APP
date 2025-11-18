import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { SongInfo } from './song-info/song-info';
import { AudioController } from './audio-controller/audio-controller';
import { Playlist } from './playlist/playlist';
import { Player } from './player/player';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { authInterceptor } from './interceptors/auth-interceptor';
import { addAuthHeaderInterceptor } from './interceptors/core/add-auth-header-interceptor';
import { SecondaryModule } from './secondary/secondary-module';

import { SearchBar } from './search/search-bar/search-bar';
import { SearchSection } from './search/search-section/search-section';
import { TrackList } from './search/track-list/track-list';
import { AlbumList } from './search/album-list/album-list';
import { Loading } from './search/loading/loading';
import { EmptySearchState } from './search/state/state';


@NgModule({
  declarations: [
    App,
    SongInfo,
    AudioController,
    Playlist,
    Player,
    SearchBar,
    SearchSection,
    TrackList,
    AlbumList,
    Loading,
    EmptySearchState
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,  
    AppRoutingModule,
    SecondaryModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        addAuthHeaderInterceptor
      ])
    ),
    CookieService,
  ],
  bootstrap: [App]
})
export class AppModule { }