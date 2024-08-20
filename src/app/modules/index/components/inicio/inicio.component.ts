import { Component, ElementRef, ViewChild } from '@angular/core';
import { CustomPopoverProductoComponent } from 'src/app/modules/shared/components/custom-popover-producto/custom-popover-producto.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  rows = [
    { id: 1, column1: 'Data 1', column2: 'Data 2', data: 'Additional data 1' },
    { id: 2, column1: 'Data 3', column2: 'Data 4', data: 'Additional data 2' },
    // Add more rows as needed
  ];

  activePopover: number | null = null;

  showPopover(id: number) {
    this.activePopover = id;
  }

  hidePopover() {
    this.activePopover = null;
  }

}
