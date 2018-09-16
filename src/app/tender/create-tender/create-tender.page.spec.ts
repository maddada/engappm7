import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTenderPage } from './create-tender.page';

describe('CreateTenderPage', () => {
  let component: CreateTenderPage;
  let fixture: ComponentFixture<CreateTenderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTenderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
