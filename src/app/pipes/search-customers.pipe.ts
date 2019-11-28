import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from '../models/customer';
@Pipe({
  name: 'searchCustomers'
})
export class SearchCustomersPipe implements PipeTransform {

  transform(items: Customer[], search: string): any {
    if (!items || !search) {
      return items;
    }
    return items.filter(item =>
      item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      item.noDocument.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
  }

}
