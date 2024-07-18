import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-label-1',
  templateUrl: './custom-label-1.component.html',
  styleUrls: ['./custom-label-1.component.css']
})
export class CustomLabel1Component {
  @Input() id!: string;
  @Input() label!: string;
  @Input() text!: string|null;
  @Input() class!: string;
}
