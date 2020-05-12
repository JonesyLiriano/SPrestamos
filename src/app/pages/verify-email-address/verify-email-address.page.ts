import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-verify-email-address',
  templateUrl: './verify-email-address.page.html',
  styleUrls: ['./verify-email-address.page.scss'],
})
export class VerifyEmailAddressPage implements OnInit{
  
  userData: User;
  constructor(public authService: AuthService, private toastService: ToastService,
              private router: Router, private loadingService: LoadingService) {    
   }

  ngOnInit() {
    this.userData = this.authService.userAuthData;
  }

  async onClick() {
    try {
    await this.loadingService.presentLoading('Cargando...');
    await this.authService.sendVerificationMail();
    this.loadingService.dismissLoading();
    this.toastService.presentSuccessToast('Se ha enviado el link para verificar su email!, revise su bandeja de entrada.');
    this.router.navigate(['/login']);
    } catch (error) {
      this.loadingService.dismissLoading();
    }
    
  }

}
