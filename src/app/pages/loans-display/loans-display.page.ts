import { Component, OnInit } from '@angular/core';
import { FcmService } from 'src/app/services/fcm.service';

@Component({
  selector: 'app-loans-display',
  templateUrl: './loans-display.page.html',
  styleUrls: ['./loans-display.page.scss'],
})
export class LoansDisplayPage implements OnInit {

  constructor(private fmc: FcmService) { }

  ngOnInit() {
    this.fmc.getToken();
  }

}
