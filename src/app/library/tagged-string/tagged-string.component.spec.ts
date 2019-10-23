import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggedStringComponent } from './tagged-string.component';

describe('TaggedStringComponent', () => {
  let component: TaggedStringComponent;
  let fixture: ComponentFixture<TaggedStringComponent>;

  beforeEach(async(() => {
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
