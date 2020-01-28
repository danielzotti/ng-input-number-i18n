import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { NgInputI18nDirective } from './ng-input-i18n.directive';
import { DecimalPipe } from '@angular/common';
import { NgInputI18nPipe } from './ng-input-i18n.pipe';
import { NgInputI18nConfig } from './ng-input-i18n.config';

@NgModule({
  declarations: [NgInputI18nDirective],
  imports: [],
  exports: [NgInputI18nDirective],
  providers: [DecimalPipe]
})
export class NgInputI18nModule {
  static forRoot(config?: NgInputI18nConfig): ModuleWithProviders {

    const configuration = {
      pipe: NgInputI18nPipe,
      production: true,
      ...config
    };

    return {
      ngModule: NgInputI18nModule,
      providers: [
        {
          provide: NgInputI18nPipe,
          useClass: configuration.pipe
        },
        {
          provide: NgInputI18nConfig,
          useValue: configuration
        }
      ]
    };
  }

  static forFeature(config?: NgInputI18nConfig): ModuleWithProviders {
    return NgInputI18nModule.forRoot(config);
  }
}
