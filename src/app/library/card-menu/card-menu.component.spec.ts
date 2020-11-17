import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardMenuComponent } from './card-menu.component';

describe('CardMenuComponent', () => {
  let component: CardMenuComponent;
  let fixture: ComponentFixture<CardMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
