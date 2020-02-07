import { Component, Inject, LOCALE_ID } from '@angular/core';
import { NgInputNumberI18nOutputValues } from '../../projects/ng-input-i18n/src/lib/ng-input-number-i18n.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mainValue = 1234.1255;
  mainFormat = '.2-2';
  outputValues: NgInputNumberI18nOutputValues;

  formats = [
    '.2-2',
    '.1-4',
    '2.2-3',
    '6.1-1',
  ];

  constructor(@Inject(LOCALE_ID) private locale) {}

  updateValues(values: NgInputNumberI18nOutputValues){
    this.outputValues = values;
  }
}
