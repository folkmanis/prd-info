import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadAdresesComponent } from './upload-adreses.component';

describe('UploadAdresesComponent', () => {
  let component: UploadAdresesComponent;
  let fixture: ComponentFixture<UploadAdresesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadAdresesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAdresesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
