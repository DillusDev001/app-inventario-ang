import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-drop-down',
  templateUrl: './custom-drop-down.component.html',
  styleUrls: ['./custom-drop-down.component.css']
})
export class CustomDropDownComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() class!: string;
  @Input() data!: any[];

  classSet: string = 'border-color-unfocus text-color-unfocus';

  inputFocus: boolean = false;

  onFocus(): void {
    this.inputFocus = true;
    this.classSet = 'focus:outline-none focus:ring-inset focus:ring-primary-700 focus:border-primary-700 text-primary-700'
  }
  onBlur(): void {
    this.inputFocus = false;
    if (this.control.errors && this.control.touched) {
      this.classSet = 'border-color-border-red text-color-error';
    } else if (!this.control.errors && this.control.touched) {
      this.classSet = 'border-color-unfocus text-color-unfocus'
    }
  }
}