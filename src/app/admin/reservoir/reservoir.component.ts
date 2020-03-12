import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {CommonService} from "../../../shared/common/common.service";

export interface ReservoirData {
  name;
  address;
  ok: boolean;
}

@Component({
  selector: 'app-admin-reservoir',
  templateUrl: './reservoir.component.html',
  styleUrls: ['./reservoir.component.scss']
})

export class ReservoirComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  loading = false;
  public result = [];
  reservoir: any;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              public router: Router,
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
      name: this.formGroup.get("name").value,
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/reservoir/list', param, {
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

  saveOrUpdate() {
    this.loading = true;
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/reservoir/save', this.reservoir, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          if (!this.reservoir.id)
            this.result.push(val);
          this.commonService.showMessage('عملیات با موفقیت انجام شد.', 'success-msg');
        },
        response => {
          this.loading = false;
        });
  }

  delete(id, index) {
    let param = {
      id: id
    };
    this.loading = true;
    this.http.post('http://127.0.0.1:9000/v1/shop/reservoir/delete', param, {
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

  openDialog(reservoir): void {
    if (!reservoir) {
      reservoir = {
        id: null,
        name: '',
        address: ''
      }
    }
    this.reservoir = reservoir;
    const dialogRef = this.dialog.open(ReservoirDialog, {
      data: {name: reservoir.name, address: reservoir.address}
    });

    dialogRef.componentInstance.onAdd.subscribe((result) => {
      this.reservoir.name = result.name;
      this.reservoir.address = result.address;
      this.reservoir.id = reservoir.id;
      this.saveOrUpdate();
      dialogRef.close();
    });

  }

}


@Component({
  selector: 'reservoir-dialog',
  templateUrl: 'reservoir-dialog.html',
})
export class ReservoirDialog {

  constructor(
    public dialogRef: MatDialogRef<ReservoirData>,
    @Inject(MAT_DIALOG_DATA) public data: ReservoirData) {}

  onNoClick(): void {
    this.dialogRef.componentInstance.ok = false;
    this.dialogRef.close();
  }

  onAdd = new EventEmitter();

  onOkClick(value) {
    this.onAdd.emit(value);
  }

}
