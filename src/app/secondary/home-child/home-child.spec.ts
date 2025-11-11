import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeChild } from './home-child';

describe('HomeChild', () => {
  let component: HomeChild;
  let fixture: ComponentFixture<HomeChild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeChild]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeChild);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
