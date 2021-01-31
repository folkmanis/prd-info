import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleListTableComponent } from './simple-list-table.component';

describe('SimpleListTableComponent', () => {
  let component: SimpleListTableComponent;
  let fixture: ComponentFixture<SimpleListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleListTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
