import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCopy } from './search.copy';

describe('SearchCopy', () => {
  let component: SearchCopy;
  let fixture: ComponentFixture<SearchCopy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCopy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchCopy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
