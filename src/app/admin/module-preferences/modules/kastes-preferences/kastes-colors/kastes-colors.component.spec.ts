import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KastesColorsComponent } from './kastes-colors.component';

describe('KastesColorsComponent', () => {
  let component: KastesColorsComponent;
  let fixture: ComponentFixture<KastesColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KastesColorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KastesColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
