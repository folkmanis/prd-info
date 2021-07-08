import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsFilterComponent } from './materials-filter.component';

describe('MaterialsFilterComponent', () => {
  let component: MaterialsFilterComponent;
  let fixture: ComponentFixture<MaterialsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
