import {NgModule} from '@angular/core';
import {LoadingComponent} from './loading.component';
import {MatProgressSpinnerModule} from '@angular/material';
@NgModule({
  imports: [
    MatProgressSpinnerModule
  ],
  declarations: [
    LoadingComponent
  ],
  entryComponents: [],
  exports: [
    LoadingComponent
  ]
})

export class LoadingModule {
}
