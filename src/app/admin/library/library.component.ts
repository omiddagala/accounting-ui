import {Component, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {GroupData, GroupDialog} from './group/group.component';

@Component({
  selector: 'app-admin-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})

export class LibraryComponent implements OnInit {
  menu: any = Menu;
  showSearchField = false;
  formGroup: FormGroup;
  loading = false;
  public result = [];
  timelineLoading = false;
  types = [
    {
      text: 'زنانه',
      value: '1'
    },
    {
      text: 'مردانه',
      value: '2'
    },
    {
      text: 'بچه گانه',
      value: '3'
    }
  ];

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              public router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      type: new FormControl(undefined),
      name: new FormControl(undefined)
    });
    this.search();
  }

  findTypeById(id) {
    for (let i in this.types) {
      if (this.types[i].value === id) {
        return this.types[i].text;
      }
    }
  }


  search() {
    this.loading = true;
    this.result = [];
    const param = {
      name: this.formGroup.get('name').value,
      type: this.formGroup.get('type').value
    };
    this.http.post<any>('http://127.0.0.1:9000/v1/shop/product/list', param, {
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

  edit(id) {
    localStorage.setItem('productCopy', JSON.stringify({}));
    this.router.navigate(['/admin/library/detail'], {queryParams: {id: id}});
  }

  copyProduct(id) {
    console.log(this.result);
    const product = this.result.filter(item => item.id === id);
    localStorage.setItem('productCopy', JSON.stringify(product[0]));
    this.router.navigate(['/admin/library/detail']);
  }

  openTimelineDialog(id) {
    this.timelineLoading = true;
    const param = {
      id
    };
    this.http.post('http://127.0.0.1:9000/v1/shop/product/fetch', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        val => {
          console.log(val);
          this.timelineLoading = false;
          this.openDialog(val);
        },
        err => {
          console.log(err);
          this.timelineLoading = false;
        }
      );
  }

  openDialog(productt) {
    const dialogRef = this.dialog.open(TimelineDialog, {
      data: {product: productt}
    });

  }

  delete(id, index) {
    let param = {
      id: id
    };
    this.loading = true;
    this.http.post('http://127.0.0.1:9000/v1/shop/product/delete', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        (val) => {
          this.loading = false;
          this.result.splice(index, 1);
        },
        response => {
          this.loading = false;
        });
  }

  addProduct() {
    localStorage.setItem('productCopy', JSON.stringify({}));
    this.router.navigate(['/admin/library/detail']);
  }


  routeToOrder(id) {
    this.router.navigate(['/admin/library/order/' + id]);
  }

}


@Component({
  selector: 'timeline-dialog',
  templateUrl: './timeline-dialog.html'
})

export class TimelineDialog implements OnInit{
  constructor(public dialogRef: MatDialogRef<TimelineDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log(this.data.product);
  }

  routeToTimeline(id) {
    this.dialogRef.close();
    this.router.navigate(['/admin/library/timeline/' + id]);
  }
}
