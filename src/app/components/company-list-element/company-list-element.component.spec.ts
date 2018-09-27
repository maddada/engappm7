import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyListElementComponent } from './company-list-element.component';

describe('CompanyListElementComponent', () => {
  let component: CompanyListElementComponent;
  let fixture: ComponentFixture<CompanyListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
