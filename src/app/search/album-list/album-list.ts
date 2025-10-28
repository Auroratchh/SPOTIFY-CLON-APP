import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-album-list',
  standalone: false,
  templateUrl: './album-list.html',
  styleUrl: './album-list.css'
})
export class AlbumList {
  albums = input.required<any[]>();
  albumSelected = output<any>();

  onAlbumClick(album: any): void {
    this.albumSelected.emit(album);
  }
}