import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadsFilterComponent } from './threads-filter.component';

describe('ThreadsFilterComponent', () => {
  let component: ThreadsFilterComponent;
  let fixture: ComponentFixture<ThreadsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
