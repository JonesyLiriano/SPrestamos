import { Pipe, PipeTransform } from '@angular/core';
// import { Customer } from '../models/customer';

@Pipe({
  name: 'searchCustomers'
})
export class SearchCustomersPipe implements PipeTransform {

  transform(items, search: string): any {
  //   if (!items || !search) {
  //     return items;
  //   }
  //   return items.filter(item =>
  //     item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
  //     item.id.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
  //   );
  }

}
