import { DecimalPipe } from '@angular/common';
import { InjectionToken, Type } from '@angular/core';
import { NgInputNumberI18nPipe } from './ng-input-number-i18n.pipe';

export class NgInputNumberI18nConfig {
  public production: boolean;
  public pipe: Type<DecimalPipe>;
  public undoOnEsc: boolean;
  public locale: string;
  constructor(options: NgInputNumberI18nConfig) {
    this.production = typeof options.production === 'boolean' ? options.production : true;
    this.undoOnEsc = typeof options.undoOnEsc === 'boolean' ? options.undoOnEsc : false;
    this.pipe = options.pipe ? options.pipe : NgInputNumberI18nPipe;
    this.locale = options.locale ? options.locale : 'it';
  }
}
