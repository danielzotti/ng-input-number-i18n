import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { getLocaleNumberSymbol, NumberSymbol } from '@angular/common';
import { NgInputNumberI18nConfig } from './ng-input-number-i18n.config';

@Injectable({
  providedIn: 'root'
})
export class NgInputNumberI18nService {

  defaultLocale: 'en-US';

  configuration: NgInputNumberI18nConfig;

  constructor(@Inject(LOCALE_ID) private locale: string, private config: NgInputNumberI18nConfig) {
    this.configuration = this.config;
  }

  getLocale() {
    return this.locale;
  }

  getLocaleDecimalSeparator(): string {
    return getLocaleNumberSymbol(this.locale ? this.locale : this.defaultLocale, NumberSymbol.Decimal);
  }

  getLocaleGroupSeparator(): string {
    return getLocaleNumberSymbol(this.locale ? this.locale : this.defaultLocale, NumberSymbol.Group);
  }
}
