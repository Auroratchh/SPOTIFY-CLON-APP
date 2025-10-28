
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-state',
  standalone: false,
  templateUrl: './state.html',
  styleUrl: './state.css'
})
export class EmptySearchState {
  type = input.required<'initial' | 'no-results'>();
}
