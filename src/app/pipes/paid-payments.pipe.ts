import { Pipe, PipeTransform } from '@angular/core';
import { LoanDetails } from '../models/loanDetails';

@Pipe({
  name: 'paidPayments'
})
export class PaidPaymentsPipe implements PipeTransform {

  transform(payments: LoanDetails[], filter: boolean): any {
    if (!payments || !filter) {  
      return null;  
  }  
  return payments.filter(payment => payment.paid == filter);
  }

}
