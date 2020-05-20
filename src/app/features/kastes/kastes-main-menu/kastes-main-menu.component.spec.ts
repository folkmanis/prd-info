import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KastesMainMenuComponent } from './kastes-main-menu.component';

describe('KastesMainMenuComponent', () => {
  let component: KastesMainMenuComponent;
  let fixture: ComponentFixture<KastesMainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KastesMainMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KastesMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
