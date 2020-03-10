import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommonService} from '../../../../shared/common/common.service';

export interface SizeData {
  value;
  ok: boolean;
}

@Component({
  selector: 'app-admin-library-size',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})

export class GroupComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  loading = false;
  public result = [];
  value: any;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              public dialog: MatDialog,
              private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      value: new FormControl(undefined)
    });
    this.search();
  }

  search() {
    this.loading = true;
    this.result = [];
    const param = {
      value: this.formGroup.get('value').value,
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/size/list', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.result.push(...val);
        },
        response => {
          this.loading = false;
        });
  }

  saveOrUpdate(size) {
    this.loading = true;
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/size/save', size, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          if (!size.id) {
            this.result.push(val);
          }
          this.commonService.showMessage('عملیات با موفقیت انجام شد.', 'success-msg');
        },
        response => {
          this.commonService.handleError(response);
          this.loading = false;
        });
  }

  delete(id, index) {
    const param = {
      id
    };
    this.loading = true;
    this.http.post('http://127.0.0.1:9000/v1/shop/size/delete', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.result.splice(index, 1);
          this.commonService.showMessage('عملیات با موفقیت انجام شد.', 'success-msg');
        },
        response => {
          this.loading = false;
        });
  }

  openDialog(size): void {
    if (!size) {
      size = {
        value: ''
      };
    }
    this.value = size.value;
    const dialogRef = this.dialog.open(GroupDialog, {
      data: {value: this.value}
    });

    dialogRef.componentInstance.onAdd.subscribe((result) => {
      size.value = result;
      this.saveOrUpdate(size);
      dialogRef.close();
    });

  }

}


@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.html',
})
export class GroupDialog {

  constructor(
    public dialogRef: MatDialogRef<SizeData>,
    @Inject(MAT_DIALOG_DATA) public data: SizeData) {
  }

  onAdd = new EventEmitter();

  onNoClick(): void {
    this.dialogRef.componentInstance.ok = false;
    this.dialogRef.close();
  }

  onOkClick(value) {
    this.onAdd.emit(value);
  }

}
