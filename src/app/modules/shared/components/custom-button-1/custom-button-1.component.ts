import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-button-1',
  templateUrl: './custom-button-1.component.html',
  styleUrls: ['./custom-button-1.component.css']
})
export class CustomButton1Component {
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
        this.class = this.class + ' bg-primary-400 hover:bg-primary-600 text-primary-50 ';
        break;

      case 'cancel':
        this.class = this.class + ' bg-primary-50 hover:bg-primary-500 text-primary-500 hover:text-primary-50 border border-primary-500';
        break;
    }

  }
}
