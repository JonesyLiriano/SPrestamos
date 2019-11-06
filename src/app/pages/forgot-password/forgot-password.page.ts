import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get email() {
    return this.emailForm.get('email');
  }

  constructor(private fb: FormBuilder, private authService: AuthService,
              private router: Router, private toastService: ToastService) { }

  ngOnInit() {
  }

  async onSubmit() {
    console.log(this.emailForm.value['email']);
    await this.authService.forgotPassword(this.emailForm.value['email']);
    this.toastService.presentSuccessToast('Se ha enviado el link para restablecer su password, verifique su bandeja de entrada.');
    this.router.navigate(['/login']);

  }

}
