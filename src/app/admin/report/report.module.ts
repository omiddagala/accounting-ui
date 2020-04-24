import {NgModule} from '@angular/core';
import {ReportComponent} from './report.component';
import {ReportRoutingModule} from './report-routing.module';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatListModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatSidenavModule, MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MainMenuModule} from '../../../shared/component/main-menu/MainMenu.module';
import {MyDatePickerModule} from '../../../shared/datepicker';
import {SharedModule} from '../../../shared/shared.module';
@NgModule({
  imports: [
    ReportRoutingModule,
    MatBadgeModule,
    ReactiveFormsModule,
    CommonModule,
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
    MainMenuModule,
    MyDatePickerModule,
    MatRadioModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    ReportComponent,
  ],
  entryComponents: []
})

export class ReportModule {

}
