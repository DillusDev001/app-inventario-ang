import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input-1-dark',
  templateUrl: './custom-input-1-dark.component.html',
  styleUrls: ['./custom-input-1-dark.component.css']
})
export class CustomInput1DarkComponent {
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
    this.classDiv = 'border-yellow-300';
    this.classIcon = 'text-yellow-300';
    this.classInput = 'text-yellow-300';
    this.classLabel = 'text-yellow-300';
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
        this.classDiv = 'border-color-unfocus text-color-unfocus'
        this.classIcon = 'text-color-unfocus';
        this.classInput = 'text-color-unfocus';
        this.classLabel = 'text-color-unfocus';
      }
    }
  }
}
