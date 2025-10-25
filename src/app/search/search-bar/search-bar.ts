import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  @Output() searchQuery = new EventEmitter<string>();
  searchText: string = '';

  onSearch() {
    if (this.searchText.trim()) {
      this.searchQuery.emit(this.searchText);
    }
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}