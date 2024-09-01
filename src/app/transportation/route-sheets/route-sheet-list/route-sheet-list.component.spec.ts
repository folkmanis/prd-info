import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteSheetListComponent } from './route-sheet-list.component';

describe('RouteSheetListComponent', () => {
  let component: RouteSheetListComponent;
  let fixture: ComponentFixture<RouteSheetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteSheetListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteSheetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
