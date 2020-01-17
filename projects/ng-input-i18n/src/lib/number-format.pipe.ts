import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: string | number, format: string = null): string {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'number') {
      value = value.toString();
    }

    return value === '0' ? '-' : !format ? value : this.decimalPipe.transform(value, format);
  }
}
