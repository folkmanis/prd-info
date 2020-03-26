import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorFinderComponent } from './selector-finder.component';

describe('SelectorFinderComponent', () => {
  let component: SelectorFinderComponent;
  let fixture: ComponentFixture<SelectorFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
