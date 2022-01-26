import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproProductComponent } from './repro-product.component';

describe('ReproProductComponent', () => {
  let component: ReproProductComponent;
  let fixture: ComponentFixture<ReproProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReproProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
