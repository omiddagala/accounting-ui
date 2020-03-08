import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';

@Component({
  selector: 'app-create-scanner',
  templateUrl: './create.html',
  styleUrls: ['./create.scss']
})
export class CreateBarcodeComponent implements OnInit {


  ngOnInit() {

  }

  success(t) {
    console.log(t)
  }
}
