import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproJobListComponent } from './repro-job-list.component';

describe('ReproJobListComponent', () => {
  let component: ReproJobListComponent;
  let fixture: ComponentFixture<ReproJobListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReproJobListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
