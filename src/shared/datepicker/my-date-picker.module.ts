import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {MyDatePicker} from './my-date-picker.component';
import {FocusDirective} from './directives/my-date-picker.focus.directive';
import {MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  declarations: [MyDatePicker, FocusDirective],
  exports: [MyDatePicker, FocusDirective]
})
export class MyDatePickerModule {
}
