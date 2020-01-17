import {
  DecimalPipe,
  getCurrencySymbol,
  getLocaleCurrencySymbol,
  getLocaleNumberFormat,
  getLocaleNumberSymbol,
  NumberFormatStyle,
  NumberSymbol
} from '@angular/common';
import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NumberFormatPipe } from './number-format.pipe';

const INPUT_NUMBER_DIRECTIVE_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgInputI18nDirective),
  multi: true
};

@Directive({
  selector: 'input [ngInputI18n],textarea [ngInputI18n]',
  providers: [INPUT_NUMBER_DIRECTIVE_CONTROL_ACCESSOR, DecimalPipe, NumberFormatPipe]
})
export class NgInputI18nDirective implements ControlValueAccessor {

  @Input()
  required: boolean;

  @Input()
  disabled: boolean;

  @Input('ngInputI18n')
  format: string;

  input: HTMLTextAreaElement | HTMLInputElement;

  inputValue: string;
  formattedValue: string;
  realValue: number;

  decimalSeparator = ','; // default for IT
  groupSeparator = '.'; // default for IT
  decimalSeparatorPlaceholder = '[DECIMAL]';
  groupSeparatorPlaceholder = '[GROUP]';

  onTouch: () => void;
  onModelChange: (_) => void;

  constructor(private el: ElementRef, private decimalPipe: DecimalPipe, private numberFormatPipe: NumberFormatPipe) {
    this.input = el.nativeElement;

    // this.decimalSeparator = getLocaleNumberSymbol('it-IT', NumberSymbol.Decimal);
    // this.groupSeparator = getLocaleNumberSymbol('it-IT', NumberSymbol.Group);

    this.decimalSeparator = getLocaleNumberSymbol('en-US', NumberSymbol.Decimal);
    this.groupSeparator = getLocaleNumberSymbol('en-US', NumberSymbol.Group);
  }

  @HostListener('focus')
  onFocus() {
    this.setInputValue(this.inputValue);
    this.input.select();
  }

  @HostListener('blur')
  onBlur() {
    this.setInputValue(this.formattedValue);
  }

  @HostListener('dblclick')
  showInfo() {
    console.log({
      displayedValue: this.inputValue,
      formattedValue: this.formattedValue,
      realValue: this.realValue
    });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
    const e = <KeyboardEvent> event;

    if (this.isTypingCommonKeys(e)) {
      // let it happen, don't do anything
      return;
    }

    if (this.isNotTypingNumersOrDecimalSeparator(e)) {
      // prevent insert
      e.preventDefault();
    }
    // console.log(this.inputValue, parseFloat(this.realValue));
    // return parseFloat(this.value);
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
    // console.log('writeValue', value);
    this.calculateValues(value);
    this.setInputValue(this.formattedValue);
  }

  onChange(value) {
    // console.log('onChange', value);
    this.onModelChange(value);
    this.onTouch();
  }

  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error("Method not implemented.");
  // }


  sanitizeValue(value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'string') {
      value = value.trim().replace(/ /g, '');
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
    // TODO: da migliorare
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'string') {
      value = this.parseFormattedFloat(value);
      // value = parseFloat(value.replace(new RegExp(this.escapeRegExp(this.decimalSeparator), 'g'), '.'));
    }
    const formattedValue = this.numberFormatPipe.transform(value, this.format);
    // TODO: chiamare una funziona che fa il replace sia di DecimalSeparator che di GroupSeparator
    //  e utilizzare 2 placeholder per evitare conflitti. ES: [decimal] e [group] al posto di , e . (o viceversa)
    if (!formattedValue) {
      return null;
    }
    // formattedValue.replace(new RegExp(this.escapeRegExp(this.decimalSeparator), 'g'), '.')
    //
    // formattedValue.replace(/\./g, this.decimalSeparatorPlaceholder)
    // formattedValue.replace(/\./g, this.decimalSeparatorPlaceholder)
    // return formattedValue.replace(/\./g, this.decimalSeparator);
    return formattedValue;
  }

  getRealValue(value: string | number) {
    // TODO: da migliorare
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'number') {
      value = value.toString();
    }
    return this.parseFormattedFloat(value);
    // return parseFloat(value.replace(new RegExp(this.escapeRegExp(this.decimalSeparator), 'g'), '.'));
  }

  getInputValue(value: string | number) {
    // TODO: da migliorare
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'number') {
      value = value.toString();
    }
    return value.replace(/\./g, this.decimalSeparator);
  }

  setInputValue(value) {
    this.input.value = value;
  }

  parseFormattedFloat(value): number {
    return parseFloat(value.replace(new RegExp(this.escapeRegExp(this.decimalSeparator), 'g'), '.'));
  }

  private isTypingCommonKeys(e: KeyboardEvent) {
    // delete, backspace, tab, esc, enter, decimal point //period (190), comma (188)
    return [46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39);
  }

  private isNotTypingNumersOrDecimalSeparator(e: KeyboardEvent) {
    // Ensure that it is a number or decimal separator (comma 188, period 190) and stop the keypress
    return (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      // Numbers
      (e.keyCode < 96 || e.keyCode > 105) &&
      (
        // Only one dot
        (this.decimalSeparator === '.') && (e.keyCode !== 190 || (e.keyCode === 190 && this.inputValue && this.inputValue.toString().indexOf(this.decimalSeparator) !== -1))
        ||
        // Only one comma
        (this.decimalSeparator === ',') && (e.keyCode !== 188 || (e.keyCode === 188 && this.inputValue && this.inputValue.toString().indexOf(this.decimalSeparator) !== -1))
      );
  }

  private escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
}
