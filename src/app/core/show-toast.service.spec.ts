import { TestBed, inject } from '@angular/core/testing';

import { ShowToastService } from './show-toast.service';

describe('ShowToastService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShowToastService]
    });
  });

  it('should be created', inject([ShowToastService], (service: ShowToastService) => {
    expect(service).toBeTruthy();
  }));
});
