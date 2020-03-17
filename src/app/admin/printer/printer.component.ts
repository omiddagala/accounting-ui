import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../shared/common/common.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-printer-component',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.scss']
})

export class PrinterComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private commonService: CommonService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      labelWidth: new FormControl('', Validators.required)
    });
  }
}

