import {NgModule} from '@angular/core';
import {CustomersComponent, DeleteCustomerDialog} from './customers.component';
import {CustomersRoutingModule} from './customers-routing.module';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatListModule, MatProgressSpinnerModule,
  MatSelectModule, MatSidenavModule, MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {SharedModule} from '../../../shared/shared.module';
import {LoadingModule} from '../../../shared/component/loading/loading.module';
import {RouterModule} from '@angular/router';
import {MainMenuModule} from '../../../shared/component/main-menu/MainMenu.module';
import {DetailComponent} from './detail/detail.component';
import {NgxBarcodeModule} from 'ngx-barcode';

@NgModule({
  imports: [
    CustomersRoutingModule,
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
    MatSidenavModule,
    RouterModule,
    MatListModule,
    MainMenuModule,
    MatToolbarModule,
    NgxBarcodeModule,
  ],
  declarations: [
    CustomersComponent,
    DetailComponent,
    DeleteCustomerDialog
  ],
  exports: [],
  entryComponents: [
    DeleteCustomerDialog
  ]
})

export class CustomersModule {}
