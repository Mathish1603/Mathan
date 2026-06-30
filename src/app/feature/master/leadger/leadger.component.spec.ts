import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadgerComponent } from './leadger.component';

describe('LeadgerComponent', () => {
  let component: LeadgerComponent;
  let fixture: ComponentFixture<LeadgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadgerComponent]
    });
    fixture = TestBed.createComponent(LeadgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
