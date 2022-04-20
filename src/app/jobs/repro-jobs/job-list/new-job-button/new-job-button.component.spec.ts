import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJobButtonComponent } from './new-job-button.component';

describe('NewJobButtonComponent', () => {
  let component: NewJobButtonComponent;
  let fixture: ComponentFixture<NewJobButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewJobButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewJobButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
