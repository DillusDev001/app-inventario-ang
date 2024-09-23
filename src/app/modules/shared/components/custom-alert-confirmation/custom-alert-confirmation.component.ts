import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-alert-confirmation',
  templateUrl: './custom-alert-confirmation.component.html',
  styleUrls: ['./custom-alert-confirmation.component.css']
})
export class CustomAlertConfirmationComponent {

  @Output() response: EventEmitter<any> = new EventEmitter();

  @Input() msgAlert!: string;
  @Input() strBtn1!: string;
  @Input() strBtn2!: string;

  onClickResponse(sw: boolean) {
    this.response.emit(
      {
        bool: sw,
        data: null
      });
  }
}