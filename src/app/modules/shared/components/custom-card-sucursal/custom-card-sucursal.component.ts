import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sucursal } from 'src/app/common/utils/app/sucursal/sucursal.interface';

@Component({
  selector: 'app-custom-card-sucursal',
  templateUrl: './custom-card-sucursal.component.html',
  styleUrls: ['./custom-card-sucursal.component.css']
})
export class CustomCardSucursalComponent {
  @Input() sucursal!: Sucursal;
  @Input() index!: number;
  @Input() class!: string;
  @Input() id_selected!: number;

  @Output() response: EventEmitter<any> = new EventEmitter<any>()

  onClickEdit(event: Event) {
    event.stopPropagation();
    this.response.emit(
      {
        bool: true,
        data: {
          id_sucursal: this.sucursal.id_sucursal,
          index: this.index,
          type: 'editar',
          nombre: this.sucursal.nombre
        }
      });
  }

  onClickAgregarAlmacen(event: Event) {
    event.stopPropagation();
    this.response.emit(
      {
        bool: true,
        data: {
          id_sucursal: this.sucursal.id_sucursal,
          index: this.index,
          type: 'agregar',
          nombre: this.sucursal.nombre
        }
      });
  }

  onClickCard(){
    this.response.emit(
      {
        bool: true,
        data: {
          id_sucursal: this.sucursal.id_sucursal,
          index: this.index,
          type: 'card',
          nombre: this.sucursal.nombre
        }
      });
  }
}
