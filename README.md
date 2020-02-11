# @danielzotti/ng-input-number-i18n

A simple directive which manages decimal numbers in `input` and `textarea` inside a `ngForm`.

- It stores the values as a JavaScript float but it displays the formatted number based on `locale` (with decimal and thousands separator). 
- On focus, it shows the real number with the decimal separator based on `locale`.
- It formats numbers using a CustomPipe that extends the DecimalPipe.
- It sanitizes number while typing (and also on paste) based on the locale thousands and decimal separator:
    - e.g. locale = `it-IT` accepts only
        - numbers: `0-9`
        - minus sign: `-`
        - thousands separator: `.`
        - decimal separator: `,`
    - e.g. locale = `en-US` accepts only
        - numbers: `0-9`
        - minus sign: `-`
        - thousands separator: `,`
        - decimal separator: `.`

## Try it yourself

- [Live demo](https://danielzotti.github.io/ng-input-number-i18n)

- [npm](https://www.npmjs.com/package/@danielzotti/ng-input-number-i18n)


- [GitHub demo](https://github.com/danielzotti/ng-input-number-i18n)
  - Run `npm install`
  - Run `npm run start` for a dev server
  - Navigate to `http://localhost:4201/`

# How to use it

## Install the package

Run `npm i @danielzotti/ng-input-number-i18n --save`

## Import the module

Import `NgInputNumberI18nModule` from `@danielzotti/ng-input-number-i18n` in `app.module.ts`

Use `forRoot` to configure the `NgInputNumberI18nModule`:
- `production`: `boolean` (default: `true`)
    - If `false` on double click event on input, all the values are logged in the console
- `undoOnEsc`: `boolean` (default: `true`)
    - If `ESC` key is pressed the changes on input value are canceled
- `pipe`: `CustomPipe`
    - The default format pipe can be overridden by a `CustomPipe`
    - `CustomPipe` must `implement` the Angular `DecimalPipe`

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { NgInputNumberI18nModule } from '@danielzotti/ng-input-number-i18n';

import { AppComponent } from "./app.component";  

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule, 
    NgInputNumberI18nModule.forRoot({ production: false, undoOnEsc: true }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Use it in `input`

```html
<form #form="ngForm">
  ...
  <input ngInputNumberI18n=".2-2" [(ngModel)]="value">
  ...
</form>
```

## ...or in `textarea`

```html
<form #form="ngForm">
  ...
  <textarea [ngInputNumberI18n]="format" [(ngModel)]="value"></textarea>
  ...
</form>
```

### @Input and @Ouput

#### Input 
- `ngInputNumberI18n: digitsInfo`
    - See [DecimalPipe docs](https://angular.io/api/common/DecimalPipe#parameters) to learn how to handle `digitsInfo`
- `onlyPositive: boolean` (default: `false`)
    - only positive number are permitted
- `selectAllOnFocus: boolean` (default: `true`)
    - the input value is selected on focus   

#### Output
- `ngInputNumberI18nValues: NgInputNumberI18nOutputValues`: emits an event with various information everytime the values change

```typescript
export interface NgInputNumberI18nOutputValues {
  realValue: number;      // the javascript value
  inputValue: string;     // the string visible in the input value (on focus)
  formattedValue: string; // the string visible
  format: string;         // the format (digitsInfo)
}
```

#### Full example

```html
<input ngInputNumberI18n="format" 
       [(ngModel)]="value"
       [onlyPositive]="true" 
       [selectAllOnFocus]="false"
       (ngInputNumberI18nValues)="updateValues($event)">
```

## Thanks to

[How to built npm ready component library with Angular](https://codeburst.io/how-to-built-npm-ready-component-library-with-angular-a812a22dc1d5) by Mohan Ram

[Providing Module Configuration Using forRoot() And Ahead-Of-Time Compiling In Angular 7.2.0](https://www.bennadel.com/blog/3565-providing-module-configuration-using-forroot-and-ahead-of-time-compiling-in-angular-7-2-0.htm) by Ben Nadel
