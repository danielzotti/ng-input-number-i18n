import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgInputI18nComponent } from './ng-input-i18n.component';

describe('NgInputI18nComponent', () => {
  let component: NgInputI18nComponent;
  let fixture: ComponentFixture<NgInputI18nComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgInputI18nComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgInputI18nComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
