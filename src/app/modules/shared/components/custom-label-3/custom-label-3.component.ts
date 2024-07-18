import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-label-3',
  templateUrl: './custom-label-3.component.html',
  styleUrls: ['./custom-label-3.component.css']
})
export class CustomLabel3Component {
  @Input() id!: string;
  @Input() label!: string;
  @Input() text!: string;
  @Input() class!: string;
}
