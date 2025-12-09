import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualMembers } from './actual.members';

describe('ActualMembers', () => {
  let component: ActualMembers;
  let fixture: ComponentFixture<ActualMembers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualMembers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualMembers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
