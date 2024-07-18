import { Component, OnInit } from '@angular/core';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';

@Component({
  selector: 'app-custom-connection-status',
  templateUrl: './custom-connection-status.component.html',
  styleUrls: ['./custom-connection-status.component.css']
})
export class CustomConnectionStatusComponent implements OnInit {
  isOnline!: boolean;

  constructor(private networkStatusService: NetworkStatusService) { }

  ngOnInit() {
    this.isOnline = this.networkStatusService.isOnline;
    this.networkStatusService.isOnline$.subscribe(status => {
      this.isOnline = status;
    });
  }
}
