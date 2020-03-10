import {NgModule} from '@angular/core';
import {MainMenuComponent} from './main-menu.component';
import {MatBadgeModule, MatButtonModule, MatIconModule, MatToolbarModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ProfileMenuComponent} from '../profile-menu/profile-menu.component';

@NgModule({
  imports: [
    MatToolbarModule,
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule
  ],
  exports: [
    MainMenuComponent
  ],
  declarations: [
    MainMenuComponent,
    ProfileMenuComponent
  ]
})

export class MainMenuModule {
}
