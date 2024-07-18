import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-status-indicator',
  templateUrl: './custom-status-indicator.component.html',
  styleUrls: ['./custom-status-indicator.component.css']
})
export class CustomStatusIndicatorComponent {
  @Input() status: number = 0;
}
