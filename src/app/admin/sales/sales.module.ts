import {NgModule} from '@angular/core';
import {SalesComponent} from './sales.component';
import {
  MatFormFieldModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule, MatButtonModule, MatInputModule, MatTooltipModule, MatRadioModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MainMenuModule} from '../../../shared/component/main-menu/MainMenu.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {LoadingModule} from '../../../shared/component/loading/loading.module';
import {SalesRoutingModule} from './sales-routing.module';
import {DetailComponent} from './detail/detail.component';
import {MyDatePickerModule} from '../../../shared/datepicker';

@NgModule({
  imports: [
    MatSidenavModule,
    RouterModule,
    MatListModule,
    CommonModule,
    MainMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    SharedModule,
    LoadingModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    SalesRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    MatRadioModule,
    MyDatePickerModule,
    FormsModule
  ],
  declarations: [
    SalesComponent,
    DetailComponent
  ],
  entryComponents: []
})

export class SalesModule {

}
