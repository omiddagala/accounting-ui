import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../../../shared/common/common.service';
@Component({
  selector: 'delete-account-dialog',
  templateUrl: './delete-account-dialog.html',
})

export class DeleteAccountDialog {
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<DeleteAccountDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private commonService: CommonService) {
  }

  delete() {
    const param = {
      id: this.data.id
    };
    this.loading = true;
    this.http.post('http://127.0.0.1:9000/v1/shop/bank/delete', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.data.result.splice(this.data.index, 1);
          this.onNoClick();
          this.commonService.showMessage('محصول با موفقیت حذف شد', 'success-msg');
        },
        response => {
          this.loading = false;
          this.onNoClick();
          this.commonService.showMessage('خطایی رخ داده است', 'error-msg');
        });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
