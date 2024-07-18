import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-my-loading',
  templateUrl: './custom-my-loading.component.html',
  styleUrls: ['./custom-my-loading.component.css']
})
export class CustomMyLoadingComponent {
  @Input() class!: string;

}
