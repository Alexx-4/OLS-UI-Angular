import { TestBed } from '@angular/core/testing';

import { AlfaInfoService } from './alfa-info.service';

describe('AlfaInfoService', () => {
  let service: AlfaInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlfaInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
