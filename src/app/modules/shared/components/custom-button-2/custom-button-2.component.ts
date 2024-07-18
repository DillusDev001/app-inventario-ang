import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-button-2',
  templateUrl: './custom-button-2.component.html',
  styleUrls: ['./custom-button-2.component.css']
})
export class CustomButton2Component {
  /** ---------------------------------- Variables de Inicio ---------------------------------- **/
  @Input() id!: String;
  @Input() label!: String;
  @Input() type!: String;
  @Input() icon!: string;
  @Input() class!: string;
  @Input() valid!: boolean;

  classBtn!: string;

  /**
   * type -> accept (Guardar, Confirmar)
   * type -> cancel (Cancelar)
   * type -> error ()
   */

  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor() { }

  /** ---------------------------------------- OnInit ----------------------------------------- **/
  ngOnInit(): void {

    switch (this.type) {
      case 'accept':
        this.class = this.class + ' bg-yellow-300 hover:bg-yellow-400 text-primary-900 hover:text-color-white';
        break;

      case 'cancel':
        this.class = this.class + ' bg-color-white hover:bg-yellow-300 text-yellow-900 hover:text-primary-50 border border-yellow-300';
        break;
    }
  }
}
