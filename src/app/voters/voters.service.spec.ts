import { TestBed } from '@angular/core/testing';

import { VotersService } from './voters.service';

describe('VotersService', () => {
  let service: VotersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
