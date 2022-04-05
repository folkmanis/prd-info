import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleInfoComponent } from './google-info.component';

describe('GoogleInfoComponent', () => {
  let component: GoogleInfoComponent;
  let fixture: ComponentFixture<GoogleInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
