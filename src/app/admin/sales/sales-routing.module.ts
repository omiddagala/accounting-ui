import {RouterModule, Routes} from '@angular/router';
import {SalesComponent} from './sales.component';
import {NgModule} from '@angular/core';

const route: Routes = [
  {
    path: '',
    component: SalesComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class SalesRoutingModule {

}
