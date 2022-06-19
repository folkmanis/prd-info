import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleListTypedContainerComponent } from './simple-list-typed-container.component';

describe('SimpleListContainerComponent', () => {
  let component: SimpleListTypedContainerComponent;
  let fixture: ComponentFixture<SimpleListTypedContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleListTypedContainerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleListTypedContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
