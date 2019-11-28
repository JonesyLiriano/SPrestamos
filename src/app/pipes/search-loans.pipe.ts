import { Pipe, PipeTransform } from '@angular/core';
import { Loan } from '../models/loan';

@Pipe({
  name: 'searchLoans'
})
export class SearchLoansPipe implements PipeTransform {

  transform(items: Loan[], search: string): any {
    if (!items || !search) {
      return items;
    }
    return items.filter(item =>
      item.loanAmount.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      item.initialDate.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
  }

}
