import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { User } from 'firebase';

@Component({
  selector: 'app-verify-email-address',
  templateUrl: './verify-email-address.page.html',
  styleUrls: ['./verify-email-address.page.scss'],
})
export class VerifyEmailAddressPage implements OnInit {

  userData: User;
  constructor(public authService: AuthService, private toastService: ToastService,
              private router: Router) {    
   }

  ngOnInit() {
    this.userData = this.authService.userAuthData;
    console.log(this.userData);
  }

  async onClick() {
    await this.authService.sendVerificationMail();
    this.toastService.presentSuccessToast('Se ha enviado el link para verificar su email!, revise su bandeja de entrada.');
    this.router.navigate(['/login']);
  }

}
