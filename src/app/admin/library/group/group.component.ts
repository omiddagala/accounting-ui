import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommonService} from '../../../../shared/common/common.service';

export interface GroupData {
  name;
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
  name: any;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              public dialog: MatDialog,
              private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(undefined)
    });
    this.search();
  }

  search() {
    this.loading = true;
    this.result = [];
    const param = {
      name: this.formGroup.get('name').value,
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/group/list', param, {
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
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/group/save', size, {
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
    this.http.post('http://127.0.0.1:9000/v1/shop/group/delete', param, {
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
        name: ''
      };
    }
    this.name = size.name;
    const dialogRef = this.dialog.open(GroupDialog, {
      data: {name: this.name}
    });

    dialogRef.componentInstance.onAdd.subscribe((result) => {
      size.name = result;
      this.saveOrUpdate(size);
      dialogRef.close();
    });

  }

}


@Component({
  selector: 'group-dialog',
  templateUrl: 'group-dialog.html',
})
export class GroupDialog {

  constructor(
    public dialogRef: MatDialogRef<GroupData>,
    @Inject(MAT_DIALOG_DATA) public data: GroupData) {
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
