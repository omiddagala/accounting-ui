import {RouterModule, Routes} from '@angular/router';
import {CustomersComponent} from './customers.component';
import {NgModule} from '@angular/core';
import {DetailComponent} from './detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent
  },
  {
    path: 'detail',
    component: DetailComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)]
})

export class CustomersRoutingModule {}
