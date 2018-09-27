import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalListElementComponent } from './proposal-list-element.component';

describe('ProposalListElementComponent', () => {
  let component: ProposalListElementComponent;
  let fixture: ComponentFixture<ProposalListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
