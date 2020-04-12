import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from './account.component';
import {NgModule} from '@angular/core';

const route: Routes = [
  {
    path: '',
    component: AccountComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
