import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleListContainerComponent } from './simple-list-container.component';

describe('SimpleListContainerComponent', () => {
  let component: SimpleListContainerComponent;
  let fixture: ComponentFixture<SimpleListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
