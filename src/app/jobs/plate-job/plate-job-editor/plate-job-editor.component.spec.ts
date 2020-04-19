import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateJobEditorComponent } from './plate-job-editor.component';

describe('PlateJobEditorComponent', () => {
  let component: PlateJobEditorComponent;
  let fixture: ComponentFixture<PlateJobEditorComponent>;

  beforeEach(async(() => {
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
