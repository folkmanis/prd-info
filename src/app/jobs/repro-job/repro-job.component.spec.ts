import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproJobComponent } from './repro-job.component';

describe('ReproJobComponent', () => {
  let component: ReproJobComponent;
  let fixture: ComponentFixture<ReproJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReproJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
