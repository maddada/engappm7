import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTenderPage } from './view-tender.page';

describe('ViewTenderPage', () => {
  let component: ViewTenderPage;
  let fixture: ComponentFixture<ViewTenderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTenderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
