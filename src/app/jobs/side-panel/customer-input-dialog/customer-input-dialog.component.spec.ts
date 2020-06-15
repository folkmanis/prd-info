import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInputDialogComponent } from './customer-input-dialog.component';

describe('CustomerInputDialogComponent', () => {
  let component: CustomerInputDialogComponent;
  let fixture: ComponentFixture<CustomerInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerInputDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
