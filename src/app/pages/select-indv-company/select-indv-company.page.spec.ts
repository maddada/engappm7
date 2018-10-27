import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectIndvCompanyPage } from './select-indv-company.page';

describe('SelectIndvCompanyPage', () => {
  let component: SelectIndvCompanyPage;
  let fixture: ComponentFixture<SelectIndvCompanyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectIndvCompanyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectIndvCompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
