import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KopskaitiComponent } from './kopskaiti.component';

describe('KopskaitiComponent', () => {
  let component: KopskaitiComponent;
  let fixture: ComponentFixture<KopskaitiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [KopskaitiComponent]
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
