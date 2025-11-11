import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstChild } from './first-child';

describe('FirstChild', () => {
  let component: FirstChild;
  let fixture: ComponentFixture<FirstChild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstChild]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstChild);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
