import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { NgInputNumberI18nDirective } from './ng-input-number-i18n.directive';
import { NgInputNumberI18nPipe } from './ng-input-number-i18n.pipe';
import { NgInputNumberI18nConfig } from './ng-input-number-i18n.config';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [NgInputNumberI18nDirective, NgInputNumberI18nPipe],
  exports: [NgInputNumberI18nDirective, NgInputNumberI18nPipe],
  providers: [DecimalPipe]
})
export class NgInputNumberI18nModule {
  static forRoot(configuration?: NgInputNumberI18nConfig): ModuleWithProviders {

    return {
      ngModule: NgInputNumberI18nModule,
      providers: [
        // In order to translate the raw, optional OPTIONS argument into an
        // instance of the NgInputNumberI18nConfig TYPE, we have to first provide it as
        // an injectable so that we can inject it into our FACTORY FUNCTION.
        {
          provide: FOR_ROOT_CONFIGURATION_TOKEN,
          useValue: configuration
        },
        // Once we've provided the OPTIONS as an injectable, we can use a FACTORY
        // FUNCTION to then take that raw configuration object and use it to
        // configure an instance of the NgInputNumberI18nConfig TYPE
        {
          provide: NgInputNumberI18nConfig,
          useClass: NgInputNumberI18nConfig,
          deps: [FOR_ROOT_CONFIGURATION_TOKEN]
        },
        {
          provide: NgInputNumberI18nPipe,
          useFactory: provideCustomPipe,
          deps: [NgInputNumberI18nConfig]
        }
      ]
    };
  }

  static forFeature(configuration?: NgInputNumberI18nConfig): ModuleWithProviders {
    return NgInputNumberI18nModule.forRoot(configuration);
  }
}

// The token that makes the raw options available to the following factory function.
// NOTE: This value has to be exported otherwise the AoT compiler won't see it.
export const FOR_ROOT_CONFIGURATION_TOKEN = new InjectionToken<NgInputNumberI18nConfig>('forRoot() NgInputNumberI18nConfig');

export function provideCustomPipe(config: NgInputNumberI18nConfig): DecimalPipe {
  return new config.pipe(config.locale);
}
