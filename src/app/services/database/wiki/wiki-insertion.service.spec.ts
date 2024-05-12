import { TestBed } from '@angular/core/testing';

import { WikiInsertionService } from './wiki-insertion.service';

describe('WikiInsertionService', () => {
  let service: WikiInsertionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WikiInsertionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
