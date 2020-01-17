import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgInputI18nDirective } from './ng-input-i18n.directive';

@NgModule({
  declarations: [NgInputI18nDirective],
  imports: [
  ],
  exports: [NgInputI18nDirective]
})
export class NgInputI18nModule {
  // static forRoot(locale): ModuleWithProviders {
  //   return {
  //     ngModule: NgInputI18nModule,
  //     providers: [ CounterService ]
  //   }
  // }
}
