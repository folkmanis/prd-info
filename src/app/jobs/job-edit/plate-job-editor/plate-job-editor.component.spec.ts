import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlateJobEditorComponent } from './plate-job-editor.component';

describe('PlateJobEditorComponent', () => {
  let component: PlateJobEditorComponent;
  let fixture: ComponentFixture<PlateJobEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlateJobEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlateJobEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
