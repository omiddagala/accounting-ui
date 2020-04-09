import {RouterModule, Routes} from '@angular/router';
import {CustomersComponent} from './customers.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)]
})

export class CustomersRoutingModule {}
