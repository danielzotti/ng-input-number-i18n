import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { getLocaleNumberSymbol, NumberSymbol } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NgInputI18nService {

  defaultLocale: 'en-US';

  constructor(@Inject(LOCALE_ID) private locale: string) {
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
