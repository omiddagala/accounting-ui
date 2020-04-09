import {NgModule} from '@angular/core';
import {CustomersComponent} from './customers.component';
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
  ],
  declarations: [
    CustomersComponent
  ],
  exports: [],
  entryComponents: []
})

export class CustomersModule{}
