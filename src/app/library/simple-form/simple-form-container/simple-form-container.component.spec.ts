import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFormContainerComponent } from './simple-form-container.component';

describe('SimpleFormContainerComponent', () => {
  let component: SimpleFormContainerComponent;
  let fixture: ComponentFixture<SimpleFormContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SimpleFormContainerComponent]
    });
    fixture = TestBed.createComponent(SimpleFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
