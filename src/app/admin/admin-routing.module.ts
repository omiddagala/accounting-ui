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
import {NotificationComponent} from './notification/notification.component';
import {GroupComponent} from './library/group/group.component';
import {TimelineComponent} from './library/timeline/timeline.component';
import {PrinterComponent} from './printer/printer.component';
import {CollectiveOrdersComponent} from './collective-orders/collective-orders.component';

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
    path: 'notification',
    component: NotificationComponent
  },
  {
    path: 'library/group',
    component: GroupComponent
  },
  {
    path: 'library/collective-orders',
    component:  CollectiveOrdersComponent
  },
  {
    path: 'library/timeline/:id',
    component: TimelineComponent
  },
  {
    path: 'printer',
    component: PrinterComponent
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
