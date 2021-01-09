import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PakosanasSarakstsComponent } from './pakosanas-saraksts.component';

describe('PakosanasSarakstsComponent', () => {
  let component: PakosanasSarakstsComponent;
  let fixture: ComponentFixture<PakosanasSarakstsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PakosanasSarakstsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PakosanasSarakstsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
