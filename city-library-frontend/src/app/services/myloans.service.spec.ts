import { TestBed } from '@angular/core/testing';

import { MyloansService } from './myloans.service';

describe('MyloansService', () => {
  let service: MyloansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyloansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
