import { Component, HostListener } from '@angular/core';
import { localStorageLogOut } from './common/utils/local/storage.local';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    //localStorageLogOut();
  }
}