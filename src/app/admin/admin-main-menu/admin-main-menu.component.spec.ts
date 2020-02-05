import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainMenuComponent } from './admin-main-menu.component';

describe('AdminMainMenuComponent', () => {
  let component: AdminMainMenuComponent;
  let fixture: ComponentFixture<AdminMainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMainMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
