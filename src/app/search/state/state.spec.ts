import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptySearchState } from './state';

describe('State', () => {
  let component: EmptySearchState;
  let fixture: ComponentFixture<EmptySearchState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptySearchState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptySearchState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
