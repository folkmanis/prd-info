import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogfileComponent } from './logfile.component';

describe('LogfileComponent', () => {
  let component: LogfileComponent;
  let fixture: ComponentFixture<LogfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [LogfileComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
