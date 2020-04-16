import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../shared/common/common.service';

@Component({
  selector: 'account-add-dialog',
  templateUrl: './add-account-dialog.html'
})

export class AddAccountDialog implements OnInit {
  formGroup: FormGroup;
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<AddAccountDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private commonService: CommonService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      bank: new FormControl('', Validators.required),
      accountNumber: new FormControl('', Validators.required)
    });
    if (this.data.item) {
      this.formGroup.patchValue({
        bank: this.data.item.bank,
        accountNumber: this.data.item.accountNumber
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkFormValidation() {
    for (const form of Object.keys(this.formGroup.controls)) {
      this.formGroup.get(form).markAsTouched();
    }
  }

  addAccount() {
    console.log('here');
    this.checkFormValidation();
    if (!this.formGroup.valid) {
      return;
    }
    this.loading = true;
    let param = {
      bank: this.formGroup.get('bank').value,
      accountNumber: this.commonService.toEnglishDigits(this.formGroup.get('accountNumber').value)
    };
    if (this.data.item) {
      param.id = this.data.item.id;
    }
    this.http.post('http://127.0.0.1:9000/v1/shop/bank/save', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.commonService.showMessage('عملیات با موفقیت انجام شد.', 'success-msg');
          this.loading = false;
          this.onNoClick();
          location.reload();
        },
        err => {
          this.loading = false;
          this.commonService.showMessage('خطایی رخ داده است', 'error-msg');
          this.onNoClick();
        });
  }
}
