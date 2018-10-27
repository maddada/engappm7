import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardArPage } from './wizard-ar.page';

describe('WizardArPage', () => {
  let component: WizardArPage;
  let fixture: ComponentFixture<WizardArPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardArPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardArPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
