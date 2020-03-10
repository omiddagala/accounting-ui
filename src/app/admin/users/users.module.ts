import {NgModule} from '@angular/core';
import {UsersComponent} from './users.component';
import {UsersRoutingModule} from './users-routing.module';
import {CommonModule} from '@angular/common';
import {MainMenuModule} from '../../../shared/component/main-menu/MainMenu.module';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatListModule, MatProgressSpinnerModule, MatSelectModule,
  MatSidenavModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
@NgModule({
  imports: [
    UsersRoutingModule,
    CommonModule,
    MainMenuModule,
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
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    UsersComponent
  ],
  exports: []
})

export class UsersModule {

}
