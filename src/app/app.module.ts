import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from '../shared/shared.module';
import {CommonService} from '../shared/common/common.service';
import {MainMenuModule} from '../shared/component/main-menu/MainMenu.module';
import {
  MatFormFieldModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material';
import {DatePickerComponent} from "../shared/component/date-picker/date-picker.component";
import {DrawerComponent} from "../shared/component/drawer/drawer.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    DatePickerComponent,
    DrawerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    MainMenuModule,
    // FacilitiesModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule
  ],
  exports: [
    DatePickerComponent,
    DrawerComponent
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
