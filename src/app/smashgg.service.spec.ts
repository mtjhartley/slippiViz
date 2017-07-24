import { TestBed, inject } from '@angular/core/testing';

import { SmashggService } from './smashgg.service';

describe('SmashggService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmashggService]
    });
  });

  it('should be created', inject([SmashggService], (service: SmashggService) => {
    expect(service).toBeTruthy();
  }));
});
