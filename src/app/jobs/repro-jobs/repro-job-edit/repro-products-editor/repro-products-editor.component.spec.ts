import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproProductsEditorComponent } from './repro-products-editor.component';

describe('ReproProductsEditorComponent', () => {
  let component: ReproProductsEditorComponent;
  let fixture: ComponentFixture<ReproProductsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ReproProductsEditorComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproProductsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
