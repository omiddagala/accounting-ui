import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {NgModule} from '@angular/core';
import {LibraryComponent} from './library/library.component';
import {DetailComponent} from './library/detail/detail.component';
import {SizeListComponent} from "./library/size/list.component";
import {ReservoirComponent} from "./reservoir/reservoir.component";
import {MyScanComponent} from "./library/barcode/scan";
import {CreateBarcodeComponent} from "./library/barcode/create";
import {OrderComponent} from './library/order/order.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    pathMatch: 'full'
  },
  {
    path: 'library',
    component: LibraryComponent,
  },
  {
    path: 'library/detail',
    component: DetailComponent
  },
  {
    path: 'library/size',
    component: SizeListComponent
  },
  {
    path: 'library/scan',
    component: MyScanComponent
  },
  {
    path: 'library/create',
    component: CreateBarcodeComponent
  },
  {
    path: 'reservoir',
    component: ReservoirComponent
  },
  {
    path: 'library/order/:product',
    component: OrderComponent
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(m => m.UsersModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
