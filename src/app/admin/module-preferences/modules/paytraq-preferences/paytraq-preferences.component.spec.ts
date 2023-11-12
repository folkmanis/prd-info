import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytraqPreferencesComponent } from './paytraq-preferences.component';

describe('PaytraqPreferencesComponent', () => {
  let component: PaytraqPreferencesComponent;
  let fixture: ComponentFixture<PaytraqPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PaytraqPreferencesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytraqPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
