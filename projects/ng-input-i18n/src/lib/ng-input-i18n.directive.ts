import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgInputI18nService } from './ng-input-i18n.service';
import { NgInputI18nPipe } from './ng-input-i18n.pipe';

const INPUT_NUMBER_DIRECTIVE_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgInputI18nDirective),
  multi: true
};

@Directive({
  selector: 'input [ngInputI18n],textarea [ngInputI18n]',
  providers: [INPUT_NUMBER_DIRECTIVE_CONTROL_ACCESSOR, NgInputI18nService]
})
export class NgInputI18nDirective implements ControlValueAccessor {

  @Input('ngInputI18n')
  format: string;

  @Input()
  required: boolean;

  @Input()
  disabled: boolean;

  @Input()
  onlyPositive = false;

  initialValue: string;

  input: HTMLTextAreaElement | HTMLInputElement;
  minusSign = '-';

  inputValue: string;
  formattedValue: string;
  realValue: number;

  decimalSeparator;
  groupSeparator;

  onTouch: () => void;
  onModelChange: (_) => void;

  constructor(private el: ElementRef, private numberFormatPipe: NgInputI18nPipe, private service: NgInputI18nService) {
    this.input = el.nativeElement;

    this.decimalSeparator = this.service.getLocaleDecimalSeparator();
    this.groupSeparator = this.service.getLocaleGroupSeparator();
  }

  @HostListener('dblclick')
  showInfo() {
    if (!this.service.configuration.production) {
      console.log({
        displayedValue: this.inputValue,
        formattedValue: this.formattedValue,
        realValue: this.realValue,
        pipe: this.numberFormatPipe,
        configuration: this.service.configuration
      });
    }
  }

  @HostListener('focus')
  onFocus() {
    this.setInputValue(this.inputValue);
    this.input.select();
  }

  @HostListener('blur')
  onBlur() {
    this.setInputValue(this.formattedValue);
    this.initialValue = this.inputValue;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
    const e: KeyboardEvent = event;

    if (this.service.configuration.undoOnEsc && this.isTypingEscKey(e)) {
      this.onChangeNumber(this.initialValue);
      return;
    }

    if (this.isTypingCommonKeys(e) || this.isTypingFunctionKeys(e) || this.isTypingNumbersOrDecimalSeparatorOrMinus(e)) {
      // let it happen, don't do anything
      return;
    }

    // prevent insert
    e.preventDefault();
  }


  @HostListener('input', ['$event.target.value'])
  onChangeNumber(value) {
    this.calculateValues(value);
    this.onChange(this.realValue);
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: string): void {
    this.initialValue = value;
    this.calculateValues(value);
    this.setInputValue(this.formattedValue);
  }

  onChange(value) {
    this.onModelChange(value);
    this.onTouch();
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.input.disabled = true;
    } else {
      this.input.disabled = false;
    }
  }

  sanitizeValue(value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'string') {
      // check spaces
      value = value.trim().replace(/ /g, '');

      // check "minus" sign
      const minusIndex = value.indexOf(this.minusSign);
      const minusNumberParts = value.split(this.minusSign);
      if (minusNumberParts.length > 1) {
        value = minusNumberParts.reduce((acc, part) => `${acc + part}`);
      }
      value = minusIndex === 0 ? `-${value}` : value;

      // check multiple decimal separators
      const numberParts = value.split(this.decimalSeparator);
      if (numberParts.length > 2) {
        value = `${numberParts[0]}${this.decimalSeparator}${numberParts[1]}`;
      }
    }
    this.setInputValue(value);
    return value;
  }

  calculateValues(value) {
    value = this.sanitizeValue(value);
    this.formattedValue = this.getFormattedValue(value);
    this.realValue = this.getRealValue(value);
    this.inputValue = this.getInputValue(value);
  }

  getFormattedValue(value: string | number) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'string') {
      value = this.parseFormattedFloat(value);
    }
    return this.numberFormatPipe.transform(value, this.format);
  }

  getRealValue(value: string | number) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'number') {
      value = value.toString();
    }
    return this.parseFormattedFloat(value);
  }

  getInputValue(value: string | number) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'number') {
      value = value.toString();
    }
    // replace the default JavaScript decimal separator with the locale decimal separator
    return value.replace(/\./g, this.decimalSeparator);
  }

  setInputValue(value) {
    this.input.value = value;
  }

  parseFormattedFloat(value): number {
    return parseFloat(value.replace(new RegExp(this.escapeRegExp(this.decimalSeparator), 'g'), '.'));
  }

  private isTypingEscKey(e: KeyboardEvent) {
    return (e.keyCode === 27);
  }

  private isTypingCommonKeys(e: KeyboardEvent) {
    return [46, 8, 9, 27, 13, 16].indexOf(e.keyCode) !== -1 || // delete, backspace, tab, esc, enter, shift
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) || // Ctrl+A
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) || // Ctrl+C
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) || // Ctrl+V
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) || // Ctrl+X
      (e.keyCode >= 35 && e.keyCode <= 39); // home, end, left, right
  }

  private isTypingFunctionKeys(e: KeyboardEvent) {
    return (e.keyCode >= 112 && e.keyCode <= 123); // F1-F12
  }

  private isTypingNumbersOrDecimalSeparatorOrMinus(e: KeyboardEvent) {
    return (
      (e.keyCode >= 48 && e.keyCode <= 57) || // number
      (e.keyCode >= 96 && e.keyCode <= 105) || // numpad
      // only one decimal separator
      (
        e.key === this.decimalSeparator && // decimal separator
        this.inputValue && this.inputValue.toString().indexOf(this.decimalSeparator) === -1
      ) ||
      // only one "minus" at the beginning
      (
        e.key === this.minusSign &&
        !this.onlyPositive &&
        this.inputValue && this.inputValue.toString().indexOf(this.minusSign) === -1
      )
    );
  }

  private escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
}
