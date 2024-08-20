import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-tab-button',
  templateUrl: './custom-tab-button.component.html',
  styleUrls: ['./custom-tab-button.component.css']
})
export class CustomTabButtonComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() icon!: string;
  @Input() class!: string;
  @Input() spanClass!: string;
  @Input() selected!: string;

  classDiv1Selected: string = 'flex flex-col w-max items-center justify-center border-x border-t border-primary-400 rounded-x-lg rounded-t-lg bg-yellow-200';
  classDiv1NotSelected: string = 'flex flex-col w-max items-center justify-center border-x border-t border-primary-400 rounded-x-lg rounded-t-lg bg-primary-50 cursor-pointer';

  classDivSelected: string = 'flex gap-2 w-full h-max px-3 py-1 items-center ';
  classDivNotSelected: string = 'flex gap-2 w-full h-max px-3 py-1 items-center';

  classSpanSelected: string = 'text-primary-900';
  classSpanNotSelected: string = 'text-primary-300';

  //bg-primary-100 rounded-t

  classParraSelected: string = 'text-primary-900';
  classParraNotSelected: string = 'text-primary-300';

  classLineSelected: string = 'w-full h-2 bg-primary-900 rounded-b';
  classLineNotSelected: string = 'w-full h-2 bg-transparent rounded-b';
}