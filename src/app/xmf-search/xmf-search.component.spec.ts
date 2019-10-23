import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmfSearchComponent } from './xmf-search.component';

describe('XmfSearchComponent', () => {
  let component: XmfSearchComponent;
  let fixture: ComponentFixture<XmfSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmfSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmfSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
