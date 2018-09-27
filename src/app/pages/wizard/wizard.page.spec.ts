import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPage } from './wizard.page';

describe('WizardPage', () => {
  let component: WizardPage;
  let fixture: ComponentFixture<WizardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
