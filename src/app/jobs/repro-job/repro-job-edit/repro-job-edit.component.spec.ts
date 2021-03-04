import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproJobEditComponent } from './repro-job-edit.component';

describe('ReproJobEditComponent', () => {
  let component: ReproJobEditComponent;
  let fixture: ComponentFixture<ReproJobEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReproJobEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproJobEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
