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
        loadChildren: () =>
          import('../pages/customers/customers.module').then(m => m.CustomersPageModule)

      },
      {
        path: 'loans-display',
        loadChildren: () =>
          import('../pages/loans-display/loans-display.module').then(m => m.LoansDisplayPageModule)
      },
      {
        path: 'loan-generator',
        loadChildren: () => import('../pages/loan-generator/loan-generator.module').then(m => m.LoanGeneratorPageModule)
      },
      {
        path: 'loans-history',
        loadChildren: () =>
          import('../pages/loans-history/loans-history.module').then(m => m.LoansHistoryPageModule)
      },
      {
        path: 'calculator',
        loadChildren: () =>
          import('../pages/calculator/calculator.module').then(m => m.CalculatorPageModule)
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('../pages/calendar/calendar.module').then(m => m.CalendarPageModule)
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../pages/reports/reports.module').then(m => m.ReportsPageModule)
      },
      {
        path: '',
        redirectTo: 'loans-display',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
