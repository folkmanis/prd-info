import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFormTypedContainerComponent } from './simple-form-typed-container.component';

describe('SimpleFormTypedContainerComponent', () => {
  let component: SimpleFormTypedContainerComponent;
  let fixture: ComponentFixture<SimpleFormTypedContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleFormTypedContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleFormTypedContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
