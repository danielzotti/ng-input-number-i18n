import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgInputI18nModule } from '../../projects/ng-input-i18n/src/lib/ng-input-i18n.module';

import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeEn from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';

export function initializeLocale() {
  const locale = 'en-US';
  registerLocaleData(localeEn, locale); // TODO: da rendere dinamico!
  return locale;
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    NgInputI18nModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: initializeLocale,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
