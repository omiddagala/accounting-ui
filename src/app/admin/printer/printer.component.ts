import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../shared/common/common.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';

@Component({
  selector: 'app-printer-component',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.scss']
})

export class PrinterComponent implements OnInit {
  formGroup: FormGroup;
  menu: any = Menu;

  constructor(private commonService: CommonService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      labelWidth: new FormControl('', Validators.required),
      labelHeight: new FormControl('', Validators.required),
      labelMarginX: new FormControl('', Validators.required),
      labelMarginY: new FormControl('', Validators.required),
      barcodeWidth: new FormControl('', Validators.required),
      barcodeHeight: new FormControl('', Validators.required),
      fontSize: new FormControl('', Validators.required),
      paperPaddingX: new FormControl('', Validators.required),
      paperPaddingY: new FormControl('', Validators.required)
    });

    this.initForm();
  }

  initForm() {
    const printer = localStorage.getItem('printer');
    if (printer) {
      const obj = JSON.parse(printer);
      this.formGroup.patchValue({
        labelWidth: obj.labelWidth,
        labelHeight: obj.labelHeight,
        labelMarginX: obj.labelMarginX,
        labelMarginY: obj.labelMarginY,
        barcodeWidth: obj.barcodeWidth,
        barcodeHeight: obj.barcodeHeight,
        fontSize: obj.fontSize,
        paperPaddingX: obj.paperPaddingX,
        paperPaddingY: obj.paperPaddingY
      });
    }
  }

  checkFormValidation() {
    for (const form of Object.keys(this.formGroup.controls)) {
      this.formGroup.get(form).markAsTouched();
    }
  }

  savePrinterSetting() {
    this.checkFormValidation();
    if (!this.formGroup.valid) {
      console.log('here')
      return;
    }
    let obj: any = {
      labelWidth: this.commonService.toEnglishDigits(this.formGroup.get('labelWidth').value),
      labelHeight: this.commonService.toEnglishDigits(this.formGroup.get('labelHeight').value),
      labelMarginX: this.commonService.toEnglishDigits(this.formGroup.get('labelMarginX').value),
      labelMarginY: this.commonService.toEnglishDigits(this.formGroup.get('labelMarginY').value),
      barcodeWidth: this.commonService.toEnglishDigits(this.formGroup.get('barcodeWidth').value),
      barcodeHeight: this.commonService.toEnglishDigits(this.formGroup.get('barcodeHeight').value),
      fontSize: this.commonService.toEnglishDigits(this.formGroup.get('fontSize').value),
      paperPaddingX: this.commonService.toEnglishDigits(this.formGroup.get('paperPaddingX').value),
      paperPaddingY: this.commonService.toEnglishDigits(this.formGroup.get('paperPaddingY').value)
    };

    obj = JSON.stringify(obj);
    localStorage.setItem('printer', obj);
    this.commonService.showMessage('تنظیمات پرینتر با موفقیت انجام شد', 'success-msg');
    this.router.navigate(['/admin']);

  }

}

