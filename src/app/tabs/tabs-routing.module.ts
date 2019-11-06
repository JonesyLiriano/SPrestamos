import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/customers/customers.module').then(m => m.CustomersPageModule)
          }
        ]
      },
      {
        path: 'loans-display',
          loadChildren: () => 
            import('../pages/loans-display/loans-display.module').then(m => m.LoansDisplayPageModule)
      },
      {
        path: 'loan-generator', 
        loadChildren: () => import('../pages/loan-generator/loan-generator.module').then(m => m.LoanGeneratorPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'loans-display',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
