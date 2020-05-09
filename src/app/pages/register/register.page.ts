import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MenuController, IonSlides } from '@ionic/angular';
import { Validators, FormBuilder} from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PasswordValidator } from 'src/app/validators/password-validator';
import { EmailValidator } from 'src/app/validators/email-validator';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  accountInfoForm = this.fb.group({
    password: ['', Validators.required],
    confirmPassword: ['', [Validators.required, PasswordValidator]],
    email: ['', [Validators.required, Validators.email]],
    confirmEmail: ['', [Validators.required, Validators.email ,EmailValidator]]
    
  });
  basicInfoForm = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', [Validators.required]],
    country: ['', [Validators.required]],
    state: ['', [Validators.required]]
  });
  get password() {
    return this.accountInfoForm.get('password');
  }
  get email() {
    return this.accountInfoForm.get('email');
  }
  get confirmEmail() {
    return this.accountInfoForm.get('confirmEmail');
  }
  get confirmPassword() {
    return this.accountInfoForm.get('confirmPassword');
  }
  get name() {
    return this.basicInfoForm.get('name');
  }
  get lastName() {
    return this.basicInfoForm.get('lastName');
  }
  get country() {
    return this.basicInfoForm.get('country');
  }
  get state() {
    return this.basicInfoForm.get('state');
  }
  public showPassword: boolean;  
  nameBtn: string;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    allowTouchMove: false
  };
  @ViewChild('slides', {static: false}) ionSlides: IonSlides;
  disablePrevBtn = true;
  disableNextBtn = false;
  user: User;

  constructor(private authService: AuthService, private router: Router,
    public menuCtrl: MenuController, private loadingService: LoadingService,
    private fb: FormBuilder, private toast: ToastService, private usersService: UsersService) { 
      
    }

    refreshEmailValidator() {
      if(this.confirmEmail.value != '') {
      this.confirmEmail.setValue(this.confirmEmail.value);
      this.confirmEmail.markAsTouched();
      }
      
    }

    refreshPasswordValidator() {
      if(this.confirmPassword.value != '') {
        this.confirmPassword.setValue(this.confirmPassword.value);
        this.confirmPassword.markAsTouched();
        }
    }


  ngOnInit() {
    this.menuCtrl.enable(false);
    this.showPassword = false;
  }

  async onSubmit() { 
    try {   
      if (this.accountInfoForm.valid && this.basicInfoForm.valid) {
        await this.loadingService.presentLoading('Cargando...');
        const user = await this.authService.registerUser(this.email.value, this.password.value);        
        this.setDataUser();
        await this.authService.setUserAuthData({displayName: this.user.name + ' ' + this.user.lastName,
                                                email: this.user.email});                                                
        const userCreated = await this.usersService.createUser(user.user.uid, this.user);
        this.loadingService.dismissLoading();
        if(userCreated !== null || userCreated !== undefined) {
          this.toast.presentSuccessToast('Verifique su correo electronico para finalizar el registro!.');
          await this.authService.sendVerificationMail();
          this.router.navigate(['/verify-email-address']);
        } else {
          this.toast.presentErrorToast('Ha ocurrido un error, intente de nuevo por favor');
        }         
        }     
      else {
        this.toast.presentDefaultToast('Verifique los campos nuevamente.');
      }
    } catch (e) {
      this.loadingService.dismissLoading();
      this.toast.presentErrorToast(e);
    }
  }

  setDataUser() {
    this.user = {
      name: this.name.value,
      lastName: this.lastName.value,
      address: {
        country: this.country.value,
        state: this.state.value
      },
      email: this.email.value,
      registerDate: new Date().toDateString(),
      lastLoginDate: new Date().toDateString(),
      emailVerified: false
    };
  }

  async doCheck() {
    const prom1 = await this.ionSlides.isBeginning();
    const prom2 = await this.ionSlides.isEnd();    
    prom1? this.disablePrevBtn = true : this.disablePrevBtn = false;
    prom2? this.disableNextBtn = true : this.disableNextBtn = false;
  }

  async goNext() {
    await this.ionSlides.slideNext(400);
  }

  async goBack() {
    await this.ionSlides.slidePrev(400);
  }
<<<<<<< HEAD
=======

  goLogin() {
    this.router.navigate(['/login']);
  }
>>>>>>> calculator
  
}
