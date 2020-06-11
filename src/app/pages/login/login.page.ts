import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroupDirective } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsersService } from 'src/app/services/users.service';
import { Storage } from '@ionic/storage';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {

  loginForm = this.fb.group({
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rememberMe: ['false']
  });
  get password() {
    return this.loginForm.get('password');
  }
  get email() {
    return this.loginForm.get('email');
  }
  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  public showPassword: boolean;
  constructor(private authService: AuthService, private router: Router,
              public menuCtrl: MenuController, private fb: FormBuilder,
              private loadingService: LoadingService, private toastService: ToastService,
              private usersService: UsersService, private storage: Storage) {
  }
  ngAfterViewInit() {
    this.retrieveLoginData();
  }
  ngOnInit() {
    this.menuCtrl.enable(false);
    this.showPassword = false;    
   }

   async saveLoginData() {
    await this.storage.set('email', this.email.value);
    await this.storage.set('password', this.password.value);
    await this.storage.set('rememberMe', this.rememberMe.value);
   }

   async removeLoginData() {
    await this.storage.remove('email');
    await this.storage.remove('password');
    await this.storage.remove('rememberMe');
   }

   async retrieveLoginData(){
    const rememberMe = await this.storage.get('rememberMe');
    if (rememberMe == true) {
      const email = await this.storage.get('email');
      const password = await this.storage.get('password');
      this.email.setValue(email);
      this.password.setValue(password);
      this.rememberMe.setValue(rememberMe);
    }    
   }

  async onClickSubmit(formDirective: FormGroupDirective) {
    try {
      if (this.loginForm.valid) {
        await this.loadingService.presentLoading('Cargando...');      
        const user = await this.authService.loginUser(this.email.value, this.password.value);
        await this.verifyRememberMeCB();
        formDirective.resetForm();
        this.loginForm.reset();   
        if (user) {
          if(user.user.emailVerified) { 
            this.updateUserLog(user.user.uid);
            this.router.navigate(['/tabs/loans-display']);    
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

  verifyRememberMeCB() {
    if (this.rememberMe.value == true) {
     return  this.saveLoginData();
    } else {
     return  this.removeLoginData();
    }

  }

  registerForm() {
    this.router.navigateByUrl('register');
  }

  async updateUserLog(uid: string) {
    await this.usersService.updateUser(uid,{lastLoginDate: new Date().toISOString()});
  }

}
