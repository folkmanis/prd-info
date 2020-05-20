import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportNewCustomersComponent } from './import-new-customers.component';

describe('ImportNewCustomersComponent', () => {
  let component: ImportNewCustomersComponent;
  let fixture: ComponentFixture<ImportNewCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportNewCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportNewCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
