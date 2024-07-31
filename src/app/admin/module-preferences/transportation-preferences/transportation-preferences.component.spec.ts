import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationPreferencesComponent } from './transportation-preferences.component';

describe('TransportationPreferencesComponent', () => {
  let component: TransportationPreferencesComponent;
  let fixture: ComponentFixture<TransportationPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportationPreferencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportationPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
