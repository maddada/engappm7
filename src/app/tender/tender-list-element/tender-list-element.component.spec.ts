import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderListElementComponent } from './tender-list-element.component';

describe('TenderListElementComponent', () => {
  let component: TenderListElementComponent;
  let fixture: ComponentFixture<TenderListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
