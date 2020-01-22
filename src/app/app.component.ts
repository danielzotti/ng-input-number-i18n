import { Component, Inject, LOCALE_ID } from '@angular/core';
import { getLocaleId, getLocaleNumberSymbol } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  values = [
    100,
    12345678.12567,
    1.16,
    31.166,
    5678.12567,
    756756712345678.12567123123,
  ];

  formats = [
    '.2-2',
    '.1-4',
    '2.2-3',
    '4.1-1',
  ];

  constructor(@Inject(LOCALE_ID) private locale) {}
}
