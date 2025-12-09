import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRecords } from './loan.records';

describe('LoanRecords', () => {
  let component: LoanRecords;
  let fixture: ComponentFixture<LoanRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanRecords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
