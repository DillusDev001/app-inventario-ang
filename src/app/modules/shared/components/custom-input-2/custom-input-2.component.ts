import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input-2',
  templateUrl: './custom-input-2.component.html',
  styleUrls: ['./custom-input-2.component.css']
})
export class CustomInput2Component {
  @Input() id!: string;
  @Input() label!: string;
  @Input() type!: string;
  @Input() autocomplete!: string;
  @Input() class!: string;
  @Input() classInp!: string;
  @Input() control!: FormControl;
  @Input() icon!: string;

  @Output() response = new EventEmitter<any>();

  classDiv: string = 'border-color-unfocus';
  classIcon: string = 'text-color-unfocus';
  classInput: string = 'text-color-unfocus' + ' ' + this.classInp;
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
    this.classDiv = 'border-color-border';
    this.classIcon = 'text-color-icon-1';
    this.classInput = 'text-color-text' + ' ' + this.classInp;
    this.classLabel = 'text-color-text';
  }
  onBlur(): void {
    this.inputFocus = false;
    if (this.control !== null) {
      if (this.control.errors && this.control.touched) {
        this.classDiv = 'border-color-border-red text-color-error';
        this.classIcon = 'text-color-icon-red';
        this.classInput = 'text-color-error' + ' ' + this.classInp;
        this.classLabel = 'text-color-error';
      } else if (!this.control.errors && this.control.touched) {
        this.classDiv = 'border-color-unfocus text-color-unfocus'
        this.classIcon = 'text-color-unfocus';
        this.classInput = 'text-color-unfocus' + ' ' + this.classInp;
        this.classLabel = 'text-color-unfocus';
      }
    }
  }

  agregarArticulo(event: any) {
    const codigoBarra = event.target.value;
    // Lógica para buscar el artículo en la base de datos y agregarlo a la lista
    this.response.emit(codigoBarra);

  }
}
