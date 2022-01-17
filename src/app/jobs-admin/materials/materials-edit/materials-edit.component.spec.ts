import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsEditComponent } from './materials-edit.component';

describe('MaterialsEditComponent', () => {
  let component: MaterialsEditComponent;
  let fixture: ComponentFixture<MaterialsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
