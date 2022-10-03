import { TestBed } from '@angular/core/testing';

import { TematicService } from './tematic.service';

describe('TematicService', () => {
  let service: TematicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TematicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
