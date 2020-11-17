import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadTabulaComponent } from './upload-tabula.component';

describe('UploadTabulaComponent', () => {
  let component: UploadTabulaComponent;
  let fixture: ComponentFixture<UploadTabulaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadTabulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTabulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
