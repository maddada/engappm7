import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileElementComponent } from './profile-element.component';

describe('ProfileElementComponent', () => {
  let component: ProfileElementComponent;
  let fixture: ComponentFixture<ProfileElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
