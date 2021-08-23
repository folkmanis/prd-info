import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionStageEditorComponent } from './production-stage-editor.component';

describe('ProductionStageEditorComponent', () => {
  let component: ProductionStageEditorComponent;
  let fixture: ComponentFixture<ProductionStageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionStageEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionStageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
