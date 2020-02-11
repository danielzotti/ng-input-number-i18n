import { Inject, InjectionToken, LOCALE_ID, ModuleWithProviders, NgModule, Type } from '@angular/core';
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
  static forRoot(configuration: NgInputNumberI18nConfig): ModuleWithProviders {

    return {
      ngModule: NgInputNumberI18nModule,
      providers: [
        // In order to translate the raw, optional OPTIONS argument into an
        // instance of the NgInputNumberI18nConfig TYPE, we have to first provide it as
        // an injectable so that we can inject it into our FACTORY FUNCTION.
        {
          provide: FOR_ROOT_OPTIONS_TOKEN,
          useValue: configuration
        },
        // Once we've provided the OPTIONS as an injectable, we can use a FACTORY
        // FUNCTION to then take that raw configuration object and use it to
        // configure an instance of the NgInputNumberI18nConfig TYPE (which will be
        // implicitly consumed by the NgInputNumberI18nPipe constructor).
        {
          provide: NgInputNumberI18nConfig,
          useFactory: provideConfigurationOptions,
          deps: [FOR_ROOT_OPTIONS_TOKEN]
        },
        {
          provide: NgInputNumberI18nPipe,
          useFactory: provideNumberFormatPipe,
          deps: [FOR_ROOT_OPTIONS_TOKEN]
        }
      ]
    };
  }

  static forFeature(config?: NgInputNumberI18nConfig): ModuleWithProviders {
    return NgInputNumberI18nModule.forRoot(config);
  }
}

// I am the token that makes the raw options available to the following factory function.
// --
// NOTE: This value has to be exported otherwise the AoT compiler won't see it.
export const FOR_ROOT_OPTIONS_TOKEN = new InjectionToken<NgInputNumberI18nConfig>('forRoot() configuration (NgInputNumberI18nConfig).');

// I translate the given raw OPTIONS into an instance of the NgInputNumberI18nConfig TYPE. This
// will allows the NgInputNumberI18nConfig class to be instantiated and injected with a fully-formed
// configuration class instead of having to deal with the Inject() meta-data and a half-
// baked set of configuration options.
// --
// NOTE: This value has to be exported otherwise the AoT compiler won't see it.
export function provideConfigurationOptions(options?: NgInputNumberI18nConfig): NgInputNumberI18nConfig {
  console.log('provideConfigurationOptions', options);
  return new NgInputNumberI18nConfig(options);
}

export function provideNumberFormatPipe(config?: NgInputNumberI18nConfig): DecimalPipe {
  console.log('provideNumberFormatPipe', config);
  const pipe = new config.pipe(config.locale);
  debugger;
  return pipe;
}
