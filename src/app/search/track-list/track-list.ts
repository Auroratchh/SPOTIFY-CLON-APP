
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-track-list',
  standalone: false,
  templateUrl: './track-list.html',
  styleUrl: './track-list.css'
})
export class TrackList {
  tracks = input.required<any[]>();
  trackSelected = output<any>();

  onTrackClick(track: any): void {
    this.trackSelected.emit(track);
  }
}