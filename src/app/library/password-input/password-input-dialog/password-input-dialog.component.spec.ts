import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInputDialogComponent } from './password-input-dialog.component';

describe('PasswordInputDialogComponent', () => {
  let component: PasswordInputDialogComponent;
  let fixture: ComponentFixture<PasswordInputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordInputDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
