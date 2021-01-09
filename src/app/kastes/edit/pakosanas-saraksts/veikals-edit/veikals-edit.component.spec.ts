import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeikalsEditComponent } from './veikals-edit.component';

describe('VeikalsEditComponent', () => {
  let component: VeikalsEditComponent;
  let fixture: ComponentFixture<VeikalsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VeikalsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VeikalsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
