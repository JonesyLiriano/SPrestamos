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
      }
    ]
  },
  {
    path: '',
    redirectTo: '/customers',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
