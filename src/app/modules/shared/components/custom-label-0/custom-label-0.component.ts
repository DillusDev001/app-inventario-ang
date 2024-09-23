import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-label-0',
  templateUrl: './custom-label-0.component.html',
  styleUrls: ['./custom-label-0.component.css']
})
export class CustomLabel0Component {
  @Input() label!: string;
  @Input() text!: string | number;
  @Input() icon!: string;

  classDiv: string = 'border-color-unfocus';
  classIcon: string = 'text-color-unfocus';
  classInput: string = 'text-color-unfocus';
  classLabel: string = 'text-color-unfocus';

  constructor() { }

  ngOnInit(): void {
    
  }
}
