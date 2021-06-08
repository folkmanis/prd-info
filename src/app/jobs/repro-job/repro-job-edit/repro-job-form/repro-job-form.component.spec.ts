import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproJobFormComponent } from './repro-job-form.component';

describe('ReproJobFormComponent', () => {
  let component: ReproJobFormComponent;
  let fixture: ComponentFixture<ReproJobFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReproJobFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproJobFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
