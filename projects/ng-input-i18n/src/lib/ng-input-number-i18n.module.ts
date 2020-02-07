import { ModuleWithProviders, NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { NgInputNumberI18nDirective } from './ng-input-number-i18n.directive';
import { NgInputNumberI18nPipe } from './ng-input-number-i18n.pipe';
import { NgInputNumberI18nConfig } from './ng-input-number-i18n.config';

@NgModule({
  declarations: [NgInputNumberI18nDirective],
  exports: [NgInputNumberI18nDirective],
  providers: [NgInputNumberI18nPipe, DecimalPipe]
})
export class NgInputNumberI18nModule {
  static forRoot(config?: NgInputNumberI18nConfig): ModuleWithProviders {

    const configuration: NgInputNumberI18nConfig = {
      pipe: NgInputNumberI18nPipe,
      production: true,
      undoOnEsc: true,
      ...config
    };

    return {
      ngModule: NgInputNumberI18nModule,
      providers: [
        {
          provide: NgInputNumberI18nPipe,
          useClass: configuration.pipe
        },
        {
          provide: NgInputNumberI18nConfig,
          useValue: configuration
        }
      ]
    };
  }

  static forFeature(config?: NgInputNumberI18nConfig): ModuleWithProviders {
    return NgInputNumberI18nModule.forRoot(config);
  }
}
