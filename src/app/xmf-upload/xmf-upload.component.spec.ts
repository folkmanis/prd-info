import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmfUploadComponent } from './xmf-upload.component';

describe('XmfUploadComponent', () => {
  let component: XmfUploadComponent;
  let fixture: ComponentFixture<XmfUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmfUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmfUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
