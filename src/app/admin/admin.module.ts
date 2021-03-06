import {NgModule} from '@angular/core';
import {AdminComponent} from './admin.component';
import {AdminRoutingModule} from './admin-routing.module';
import {DeleteDialog, ImageDialog, LibraryComponent, TimelineDialog} from './library/library.component';
import { NgxCurrencyModule } from "ngx-currency";
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import {MainMenuModule} from '../../shared/component/main-menu/MainMenu.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CountDialog, DetailComponent} from './library/detail/detail.component';
import {SharedModule} from '../../shared/shared.module';
import {AudioUploaderComponent} from '../../shared/audio-uploader/audio-uploader.component';
import {DocUploaderComponent} from '../../shared/doc-uploader/doc-uploader.component';
import {VideoUploaderComponent} from '../../shared/video-uploader/video-uploader.component';
import {LoadingModule} from '../../shared/component/loading/loading.module';
import {InfinitScrollComponent} from '../../shared/component/infinite-scroll/infinit-scroll-component';
import {SizeDialog, SizeListComponent} from './library/size/list.component';
import {ReservoirComponent, ReservoirDialog} from './reservoir/reservoir.component';
import {MyDatePickerModule} from '../../shared/datepicker';
import {MyScanComponent} from './library/barcode/scan';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import {CreateBarcodeComponent} from './library/barcode/create';
import { QRCodeModule } from 'angular2-qrcode';
import {OrderComponent, OrderCountDialog} from './library/order/order.component';
import {NotificationComponent, NotificationDialog} from './notification/notification.component';
import {GroupComponent, GroupDialog} from './library/group/group.component';
import {TimelineComponent} from './library/timeline/timeline.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import {PrinterComponent} from './printer/printer.component';
import {CollectiveOrderCountDialog, CollectiveOrdersComponent} from './collective-orders/collective-orders.component';
import {CustomersModule} from './customers/customers.module';

@NgModule({
  imports: [
    AdminRoutingModule,
    MatSidenavModule,
    MatListModule,
    MainMenuModule,
    MatToolbarModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    SharedModule,
    LoadingModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatDialogModule,
    FormsModule,
    MyDatePickerModule,
    ZXingScannerModule,
    QRCodeModule,
    MatAutocompleteModule,
    NgxBarcodeModule,
    NgxCurrencyModule,
    CustomersModule
  ],
  declarations: [
    AdminComponent,
    LibraryComponent,
    DetailComponent,
    CountDialog,
    SizeListComponent,
    SizeDialog,
    ReservoirComponent,
    ReservoirDialog,
    MyScanComponent,
    CreateBarcodeComponent,
    OrderComponent,
    NotificationComponent,
    GroupComponent,
    GroupDialog,
    TimelineComponent,
    OrderCountDialog,
    NotificationDialog,
    TimelineDialog,
    PrinterComponent,
    DeleteDialog,
    CollectiveOrdersComponent,
    CollectiveOrderCountDialog,
    ImageDialog
  ],
  exports: [
    AudioUploaderComponent,
    DocUploaderComponent,
    VideoUploaderComponent,
    InfinitScrollComponent,
  ],
  entryComponents: [
    CountDialog,
    SizeDialog,
    ReservoirDialog,
    OrderCountDialog,
    GroupDialog,
    NotificationDialog,
    TimelineDialog,
    DeleteDialog,
    CollectiveOrderCountDialog,
    ImageDialog
  ]
})

export class AdminModule {
}
