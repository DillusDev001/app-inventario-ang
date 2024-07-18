import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-label-2',
  templateUrl: './custom-label-2.component.html',
  styleUrls: ['./custom-label-2.component.css']
})
export class CustomLabel2Component {
  @Input() id!: string;
  @Input() label!: string;
  @Input() text!: string | null;
  @Input() class!: string;
}
