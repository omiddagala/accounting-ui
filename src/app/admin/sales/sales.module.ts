import {NgModule} from '@angular/core';
import {SalesComponent} from './sales.component';
import {
  MatFormFieldModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule, MatButtonModule, MatInputModule, MatTooltipModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MainMenuModule} from '../../../shared/component/main-menu/MainMenu.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {LoadingModule} from '../../../shared/component/loading/loading.module';
import {SalesRoutingModule} from './sales-routing.module';

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
    MatTooltipModule
  ],
  declarations: [
    SalesComponent
  ],
  entryComponents: []
})

export class SalesModule {

}
