import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading-component',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

export class LoadingComponent {
  @Input() value = 45;
  @Input() diameter = 75;
  @Input() strokeWidth = 8;
}
