import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-label-4',
  templateUrl: './custom-label-4.component.html',
  styleUrls: ['./custom-label-4.component.css']
})
export class CustomLabel4Component {
  @Input() id!: string;
  @Input() label!: string;
  @Input() text!: string;
  @Input() class!: string;
}
