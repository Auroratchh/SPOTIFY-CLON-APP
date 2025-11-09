import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playlist } from './playlist';

describe('Playlist', () => {
  let component: Playlist;
  let fixture: ComponentFixture<Playlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Playlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
