import { DecimalPipe } from '@angular/common';
import { Type } from '@angular/core';

export class NgInputNumberI18nConfig {
  production?: boolean;
  pipe?: Type<DecimalPipe>;
  undoOnEsc?: boolean;
}
