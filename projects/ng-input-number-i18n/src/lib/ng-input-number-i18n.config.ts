import { DecimalPipe } from '@angular/common';
import { Type } from '@angular/core';
import { NgInputNumberI18nPipe } from './ng-input-number-i18n.pipe';


export class NgInputNumberI18nConfig {
  public production: boolean;
  public pipe: Type<DecimalPipe>;
  public undoOnEsc: boolean;

  constructor(options: NgInputNumberI18nConfig) {
    this.production = options && typeof options.production === 'boolean' ? options.production : true;
    this.undoOnEsc = options && typeof options.undoOnEsc === 'boolean' ? options.undoOnEsc : false;
    this.pipe = options && options.pipe ? options.pipe : NgInputNumberI18nPipe;
  }
}
