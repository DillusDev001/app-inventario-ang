import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dot-menu',
  templateUrl: './custom-dot-menu.component.html',
  styleUrls: ['./custom-dot-menu.component.css']
})
export class CustomDotMenuComponent {

  @Input() data!: any[];
  @Input() class!: string;

  @Output() response: EventEmitter<any> = new EventEmitter();

  // Menu
  isDropdownOpen: boolean = false;

  onMouseEnter() {
    this.isDropdownOpen= true;
  }

  onMouseLeave() {
    this.isDropdownOpen= false;
  }

  toggleDropdown() {
    this.isDropdownOpen = true;
  }

  onClickItemMenu(index: number){
    this.response.emit(
      {
        bool: true,
        data: this.data[index]['value'],
      }
    );
    this.isDropdownOpen = false;
  }
}
