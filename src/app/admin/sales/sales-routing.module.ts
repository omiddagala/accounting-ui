import {RouterModule, Routes} from '@angular/router';
import {SalesComponent} from './sales.component';
import {NgModule} from '@angular/core';
import {SaleDetailComponent} from './sale-detail/sale-detail.component';

const route: Routes = [
  {
    path: '',
    component: SalesComponent
  },
  {
    path: 'detail',
    component: SaleDetailComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class SalesRoutingModule {

}
