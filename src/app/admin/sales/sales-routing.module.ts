import {RouterModule, Routes} from '@angular/router';
import {SalesComponent} from './sales.component';
import {NgModule} from '@angular/core';
import {DetailComponent} from './detail/detail.component';

const route: Routes = [
  {
    path: '',
    component: SalesComponent
  },
  {
    path: 'detail',
    component: DetailComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class SalesRoutingModule {

}
