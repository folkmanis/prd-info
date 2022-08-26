import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInputGroupComponent } from './password-input-group.component';

describe('PasswordInputGroupComponent', () => {
  let component: PasswordInputGroupComponent;
  let fixture: ComponentFixture<PasswordInputGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordInputGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordInputGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
