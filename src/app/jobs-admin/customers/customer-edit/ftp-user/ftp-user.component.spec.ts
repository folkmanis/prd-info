import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtpUserComponent } from './ftp-user.component';

describe('FtpUserComponent', () => {
  let component: FtpUserComponent;
  let fixture: ComponentFixture<FtpUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FtpUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FtpUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
