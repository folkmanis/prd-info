import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleGroupComponent } from './module-group.component';

describe('ModuleGroupComponent', () => {
  let component: ModuleGroupComponent;
  let fixture: ComponentFixture<ModuleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
