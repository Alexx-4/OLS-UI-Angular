import { TestBed } from '@angular/core/testing';

import { ClientAppService } from './client-app.service';

describe('ClientAppService', () => {
  let service: ClientAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
