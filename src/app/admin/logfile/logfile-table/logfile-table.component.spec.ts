import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogfileTableComponent } from './logfile-table.component';

describe('LogfileTableComponent', () => {
  let component: LogfileTableComponent;
  let fixture: ComponentFixture<LogfileTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LogfileTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogfileTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
