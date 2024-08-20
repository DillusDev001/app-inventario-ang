import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-custom-popover-producto',
  templateUrl: './custom-popover-producto.component.html',
  styleUrls: ['./custom-popover-producto.component.css']
})
export class CustomPopoverProductoComponent {

  @Input() popoverData: string | undefined;

}
