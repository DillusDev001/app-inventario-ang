import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input-1',
  templateUrl: './custom-input-1.component.html',
  styleUrls: ['./custom-input-1.component.css']
})
export class CustomInput1Component {
  @Input() id!: string;
  @Input() label!: string;
  @Input() type!: string;
  @Input() autocomplete!: string;
  @Input() class!: string;
  @Input() control!: FormControl;
  @Input() icon!: string;

  classDiv: string = 'border-color-unfocus';
  classIcon: string = 'text-color-unfocus';
  classInput: string = 'text-color-unfocus';
  classLabel: string = 'text-color-unfocus';

  isPassword!: boolean;
  isHidden: boolean = true;

  inputText: string = '';
  inputFocus: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
    if (this.type === 'password') this.isPassword = true;
  }

  showOrHiddenPassword() {
    this.inputFocus = true;

    this.isHidden = !this.isHidden;

    if (this.isHidden) {
      this.type = 'password';
    }
    else {
      this.type = 'text';
    }
  }

  onFocus(): void {
    this.inputFocus = true;
    this.classDiv = 'border-primary-700';
    this.classIcon = 'text-primary-700';
    this.classInput = 'text-primary-700';
    this.classLabel = 'text-primary-700';
  }
  onBlur(): void {
    this.inputFocus = false;
    if (this.control !== null) {
      if (this.control.errors && this.control.touched) {
        this.classDiv = 'border-color-border-red text-color-error';
        this.classIcon = 'text-color-icon-red';
        this.classInput = 'text-color-error';
        this.classLabel = 'text-color-error';
      } else if (!this.control.errors && this.control.touched) {
        this.classDiv = 'border-color-unfocus text-text-color-unfocus'
        this.classIcon = 'text-color-unfocus';
        this.classInput = 'text-color-unfocus';
        this.classLabel = 'text-color-unfocus';
      }
    }
  }
}
