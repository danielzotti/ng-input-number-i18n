import { TestBed } from '@angular/core/testing';

import { NgInputI18nService } from './ng-input-i18n.service';

describe('NgInputI18nService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgInputI18nService = TestBed.get(NgInputI18nService);
    expect(service).toBeTruthy();
  });
});
