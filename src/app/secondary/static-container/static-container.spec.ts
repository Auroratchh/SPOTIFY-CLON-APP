import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticContainer } from './static-container';

describe('StaticContainer', () => {
  let component: StaticContainer;
  let fixture: ComponentFixture<StaticContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaticContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
