import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'numberFormat'
})
export class NgInputNumberI18nPipe extends DecimalPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale) {
    super(locale);
  }

  transform(value: string | number, format: string = null): string {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'number') {
      value = value.toString();
    }

    return value === '0' ? '0' : !format ? value : super.transform(value, format);
  }
}
