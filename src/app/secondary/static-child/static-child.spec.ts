import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticChild } from './static-child';

describe('StaticChild', () => {
  let component: StaticChild;
  let fixture: ComponentFixture<StaticChild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaticChild]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticChild);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
