import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroupDirective } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { FcmService } from 'src/app/services/fcm.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = this.fb.group({
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  get password() {
    return this.loginForm.get('password');
  }
  get email() {
    return this.loginForm.get('email');
  }

  public showPassword: boolean;
  constructor(private authService: AuthService, private router: Router,
              public menuCtrl: MenuController, private fb: FormBuilder,
              private loadingService: LoadingService, private toastService: ToastService) {
  }
  ngOnInit() {
    this.menuCtrl.enable(false);
    this.showPassword = false;
  }

  async onClickSubmit(formDirective: FormGroupDirective) {
    try {
      if (this.loginForm.valid) {
        await this.loadingService.presentLoading('Cargando...');      
        const user = await this.authService.loginUser(this.email.value, this.password.value);
        this.loadingService.dismissLoading();  
        formDirective.resetForm();
        this.loginForm.reset();   
        if (user) {
          if(user.user.emailVerified) {  
            this.router.navigate(['/tabs/customers']);    
          } else {         
            this.router.navigate(['verify-email-address']);   
          }
        }      
      } else {
          this.toastService.presentDefaultToast('Verifique los campos nuevamente.');
        }
    } catch(e) {
        this.toastService.presentErrorToast(e);
        this.loadingService.dismissLoading();
    }
  }

  registerForm() {
    this.router.navigateByUrl('register');
  }

}
