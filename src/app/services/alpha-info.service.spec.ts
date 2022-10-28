import { TestBed } from '@angular/core/testing';

import { AlphaInfoService } from './alpha-info.service';

describe('AlphaInfoService', () => {
  let service: AlphaInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
