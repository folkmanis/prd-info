import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCountComponent } from './status-count.component';

describe('StatusCountComponent', () => {
  let component: StatusCountComponent;
  let fixture: ComponentFixture<StatusCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
