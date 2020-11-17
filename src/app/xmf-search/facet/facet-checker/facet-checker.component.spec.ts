import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacetCheckerComponent } from './facet-checker.component';

describe('FacetCheckerComponent', () => {
  let component: FacetCheckerComponent;
  let fixture: ComponentFixture<FacetCheckerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacetCheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
