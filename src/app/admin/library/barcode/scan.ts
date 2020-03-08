import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/library';

@Component({
  selector: 'app-scanner',
  templateUrl: './scan.html',
  encapsulation: ViewEncapsulation.None,
})
export class MyScanComponent implements OnInit {


  ngOnInit() {

  }

  success(t) {
    console.log(t)
  }
}
