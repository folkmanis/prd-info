import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropFolderComponent } from './drop-folder.component';

describe('DropFolderComponent', () => {
  let component: DropFolderComponent;
  let fixture: ComponentFixture<DropFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropFolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
