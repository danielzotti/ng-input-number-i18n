import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgInputNumberI18nModule } from '../../projects/ng-input-number-i18n/src/lib/ng-input-number-i18n.module';

import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import localeZh from '@angular/common/locales/zh';

import { FormsModule } from '@angular/forms';
import { CustomFormatPipe } from './custom.pipe';

export function initializeLocale() {
  // const locale = 'en-US';
  // registerLocaleData(localeEn, locale);
  // const locale = 'fr';
  // registerLocaleData(localeFr, locale);
  // const locale = 'zh';
  // registerLocaleData(localeZh, locale);
  const locale = 'it-IT';
  registerLocaleData(localeIt, locale);
  return locale;
}

@NgModule({
  declarations: [
    AppComponent,
    CustomFormatPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    NgInputNumberI18nModule.forRoot({ pipe: CustomFormatPipe, production: false, undoOnEsc: false, locale: initializeLocale() }),
    // NgInputNumberI18nModule.forRoot({ production: false, undoOnEsc: true }),
  ],
  providers: [
    CustomFormatPipe,
    {
      provide: LOCALE_ID,
      useFactory: initializeLocale,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
