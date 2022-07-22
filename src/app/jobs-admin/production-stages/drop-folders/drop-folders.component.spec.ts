import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropFoldersComponent } from './drop-folders.component';

describe('DropFoldersComponent', () => {
  let component: DropFoldersComponent;
  let fixture: ComponentFixture<DropFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropFoldersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
