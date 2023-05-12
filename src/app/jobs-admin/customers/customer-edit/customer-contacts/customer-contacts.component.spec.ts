import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerContactsComponent } from './customer-contacts.component';

describe('CustomerContactsComponent', () => {
  let component: CustomerContactsComponent;
  let fixture: ComponentFixture<CustomerContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
