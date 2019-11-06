import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CustomersService } from 'src/app/services/customers.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-loan-generator',
  templateUrl: './loan-generator.page.html',
  styleUrls: ['./loan-generator.page.scss'],
})
export class LoanGeneratorPage implements OnInit {

  loanForm = this.fb.group({
    name: ['', Validators.required],
    noDocument: ['', Validators.required],
    state: ['', Validators.required],
    street: ['', Validators.required],    
    phone: ['', [Validators.required]],
    secondPhone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  get name() {
    return this.loanForm.get('name');
  }
  get noDocument() {
    return this.loanForm.get('noDocument');
  }
  get state() {
    return this.loanForm.get('state');
  }
  get street() {
    return this.loanForm.get('street');
  }
  get phone() {
    return this.loanForm.get('phone');
  }
  get secondPhone() {
    return this.loanForm.get('secondPhone');
  }

  constructor(private alertController: AlertController, private fb: FormBuilder) { }

  ngOnInit() {
  }

  onSubmit() {

  }

}
