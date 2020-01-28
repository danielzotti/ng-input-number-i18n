import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { NgInputI18nDirective } from './ng-input-i18n.directive';
import { DecimalPipe } from '@angular/common';
import { NgInputI18nPipe } from './ng-input-i18n.pipe';

@NgModule({
  declarations: [NgInputI18nDirective],
  imports: [],
  exports: [NgInputI18nDirective],
  providers: [DecimalPipe]
})
export class NgInputI18nModule {
  static forRoot(customPipe?: Type<DecimalPipe>): ModuleWithProviders {
    if (!customPipe) {
      customPipe = NgInputI18nPipe;
    }
    return {
      ngModule: NgInputI18nModule,
      providers: [
        {
          provide: NgInputI18nPipe,
          useClass: customPipe
        }
      ]
    };
  }

  static forFeature(customPipe: Type<DecimalPipe>): ModuleWithProviders {
    return NgInputI18nModule.forRoot(customPipe);
  }

}
