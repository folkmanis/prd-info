import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedSnackbarComponent } from './deleted-snackbar.component';

describe('DeletedSnackbarComponent', () => {
  let component: DeletedSnackbarComponent;
  let fixture: ComponentFixture<DeletedSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
