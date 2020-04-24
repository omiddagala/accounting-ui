import {RouterModule, Routes} from '@angular/router';
import {ReportComponent} from './report.component';
import {NgModule} from '@angular/core';

const route: Routes = [
  {
    path: '',
    component: ReportComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class ReportRoutingModule {

}
