import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSelectRouteComponent } from './find-select-route.component';

describe('FindSelectRouteComponent', () => {
  let component: FindSelectRouteComponent;
  let fixture: ComponentFixture<FindSelectRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindSelectRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindSelectRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
