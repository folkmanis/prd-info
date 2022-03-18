import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerContactEditorComponent } from './customer-contact-editor.component';

describe('CustomerContactEditorComponent', () => {
  let component: CustomerContactEditorComponent;
  let fixture: ComponentFixture<CustomerContactEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerContactEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerContactEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
