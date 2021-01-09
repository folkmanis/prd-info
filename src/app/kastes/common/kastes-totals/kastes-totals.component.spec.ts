import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KastesTotalsComponent } from './kastes-totals.component';

describe('KastesTotalsComponent', () => {
  let component: KastesTotalsComponent;
  let fixture: ComponentFixture<KastesTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KastesTotalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KastesTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
