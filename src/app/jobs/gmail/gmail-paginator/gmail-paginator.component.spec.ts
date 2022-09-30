import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmailPaginatorComponent } from './gmail-paginator.component';

describe('GmailPaginatorComponent', () => {
  let component: GmailPaginatorComponent;
  let fixture: ComponentFixture<GmailPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmailPaginatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmailPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
