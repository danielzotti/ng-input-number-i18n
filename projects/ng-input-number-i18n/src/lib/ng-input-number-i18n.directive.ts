import { Directive, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgInputNumberI18nService } from './ng-input-number-i18n.service';
import { NgInputNumberI18nPipe } from './ng-input-number-i18n.pipe';
import { NgInputNumberI18nOutputValues } from './ng-input-number-i18n.models';

const INPUT_NUMBER_DIRECTIVE_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgInputNumberI18nDirective),
  multi: true
};

@Directive({
  selector: 'input [ngInputNumberI18n],textarea [ngInputNumberI18n]',
  providers: [INPUT_NUMBER_DIRECTIVE_CONTROL_ACCESSOR, NgInputNumberI18nService]
})
export class NgInputNumberI18nDirective implements ControlValueAccessor, OnChanges {

  @Input('ngInputNumberI18n')
  format: string;

  @Input()
  required: boolean;

  @Input()
  disabled: boolean;

  @Input()
  onlyPositive = false;

  @Input()
  selectAllOnFocus = true;

  @Output()
  ngInputNumberI18nValues: EventEmitter<NgInputNumberI18nOutputValues> = new EventEmitter<NgInputNumberI18nOutputValues>();

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

  constructor(private el: ElementRef, private numberFormatPipe: NgInputNumberI18nPipe, private service: NgInputNumberI18nService) {
    this.input = el.nativeElement;

    this.decimalSeparator = this.service.getLocaleDecimalSeparator();
    this.groupSeparator = this.service.getLocaleGroupSeparator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.format && !changes.format.firstChange) {
      // If format value changes, the format process should be re-init
      this.writeValue(this.inputValue);
    }
  }


  @HostListener('dblclick')
  showInfo() {
    if (!this.service.configuration.production) {
      console.log({
        inputValue: this.inputValue,
        formattedValue: this.formattedValue,
        realValue: this.realValue,
        configuration: this.service.configuration,
        // pipe: this.numberFormatPipe,
      });
    }
  }

  @HostListener('focus')
  onFocus() {
    this.setInputValue(this.inputValue);
    if (this.selectAllOnFocus) {
      this.input.select();
    }
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
    this.updateOutputValues();
  }

  onChange(value) {
    this.onModelChange(value);
    this.onTouch();
    this.updateOutputValues();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.input.disabled = isDisabled;
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

  updateOutputValues() {
    this.ngInputNumberI18nValues.emit({
      formattedValue: this.formattedValue,
      realValue: this.realValue,
      inputValue: this.inputValue,
      format: this.format
    });
  }
}
