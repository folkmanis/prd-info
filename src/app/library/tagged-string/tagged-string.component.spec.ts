import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaggedStringComponent } from './tagged-string.component';

describe('TaggedStringComponent', () => {
  let component: TaggedStringComponent;
  let fixture: ComponentFixture<TaggedStringComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaggedStringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggedStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
