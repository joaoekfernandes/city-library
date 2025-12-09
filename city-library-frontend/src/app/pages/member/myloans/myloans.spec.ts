import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myloans } from './myloans';

describe('Myloans', () => {
  let component: Myloans;
  let fixture: ComponentFixture<Myloans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myloans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myloans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
