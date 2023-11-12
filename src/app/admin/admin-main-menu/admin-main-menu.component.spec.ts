import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminMainMenuComponent } from './admin-main-menu.component';

describe('AdminMainMenuComponent', () => {
  let component: AdminMainMenuComponent;
  let fixture: ComponentFixture<AdminMainMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [AdminMainMenuComponent]
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
