import { Injectable } from '@angular/core';
import { AdMob } from "@admob-plus/ionic";


@Injectable({
  providedIn: 'root'
})
export class AdmobService {
  bannerAndroidId = 'ca-app-pub-4082599508278871/5192415762';

  constructor(private admob: AdMob) { }

  showAdmobBanner() {
    return this.admob.banner.show({ id: this.bannerAndroidId});
  }
}
