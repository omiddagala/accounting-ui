import {ModuleWithProviders, NgModule} from '@angular/core';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatToolbarModule, MatCardModule
} from '@angular/material';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {CommonModule} from '@angular/common';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {ProfileComponent} from './profile/profile.component';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MainMenuModule} from '../../shared/component/main-menu/MainMenu.module';
import {LoadingModule} from '../../shared/component/loading/loading.module';
import {ImageUploaderComponent} from '../../shared/image-uploader/image-uploader';

@NgModule({
  imports: [
    AuthRoutingModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    SharedModule,
    ReactiveFormsModule,
    MainMenuModule,
    LoadingModule,
  ],
  exports: [
    ImageUploaderComponent
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    ProfileComponent,
  ],
  providers: []
})

export class AuthModule {
}
