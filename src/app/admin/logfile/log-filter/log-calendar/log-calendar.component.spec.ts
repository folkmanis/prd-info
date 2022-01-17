import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogCalendarComponent } from './log-calendar.component';

describe('LogCalendarComponent', () => {
  let component: LogCalendarComponent;
  let fixture: ComponentFixture<LogCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
