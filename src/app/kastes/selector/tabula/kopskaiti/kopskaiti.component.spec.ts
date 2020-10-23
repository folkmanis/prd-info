import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KopskaitiComponent } from './kopskaiti.component';

describe('KopskaitiComponent', () => {
  let component: KopskaitiComponent;
  let fixture: ComponentFixture<KopskaitiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KopskaitiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KopskaitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
