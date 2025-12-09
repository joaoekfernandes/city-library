import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDocuments } from './manage.documents';

describe('ManageDocuments', () => {
  let component: ManageDocuments;
  let fixture: ComponentFixture<ManageDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDocuments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDocuments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
