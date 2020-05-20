import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateJobComponent } from './plate-job.component';

describe('PlateJobComponent', () => {
  let component: PlateJobComponent;
  let fixture: ComponentFixture<PlateJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlateJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlateJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
