import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-menu-button',
  templateUrl: './custom-menu-button.component.html',
  styleUrls: ['./custom-menu-button.component.css']
})
export class CustomMenuButtonComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() icon!: string;
  @Input() spanClass!: string;
  @Input() selected!: string;
  @Input() link!: string;

  classDivSelected: string = 'border border-yellow-300 rounded-lg bg-yellow-300';
  classSpanSelected: string = 'text-primary-900';
  classParraSelected: string = 'text-primary-900';

  classDivNotSelected: string = 'border-0 rounded-lg bg-transparent cursor-pointer hover:border hover:border-primary-50';
  classSpanNotSelected: string = 'text-primary-300';
  classParraNotSelected: string = 'text-primary-300';
}
