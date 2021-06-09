import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproJobsComponent } from './repro-jobs.component';

describe('ReproJobListComponent', () => {
  let component: ReproJobsComponent;
  let fixture: ComponentFixture<ReproJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReproJobsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
