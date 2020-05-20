import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAdresesComponent } from './upload-adreses.component';

describe('UploadAdresesComponent', () => {
  let component: UploadAdresesComponent;
  let fixture: ComponentFixture<UploadAdresesComponent>;

  beforeEach(async(() => {
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
