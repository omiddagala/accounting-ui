import {NgModule} from '@angular/core';
import {AccountComponent} from './account.component';
import {AccountRoutingModule} from './account-routing.module';
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
import {AddAccountDialog} from './add-account/add-account-dialog';

@NgModule({
  imports: [
    AccountRoutingModule,
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
    AccountComponent,
    AddAccountDialog
  ],
  entryComponents: [
    AddAccountDialog
  ]
})

export class AccountModule {

}
