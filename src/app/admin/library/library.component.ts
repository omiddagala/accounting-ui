import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Menu from '../../../shared/data/menu.json';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {QRCode} from "qrcode-generator-ts";

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
              private router: Router) {
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

  openLink(url: string) {
    window.open(url, '_blank');
  }

  search() {
    this.loading = true;
    this.result = [];
    const param = {
      name: this.formGroup.get("name").value,
      type: this.formGroup.get("type").value
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
    this.router.navigate(['/admin/library/detail'], { queryParams: { id: id } });
  }

  readQR() {
    this.router.navigate(['/admin/library/scan']);
  };

  generateQRCode(item) {
    // var qr = new QRCode();
    // qr.addData(new QRAlphaNum(item.reservoir.id + 'Z' + item.id) );
    // qr.make();
    // var img = document.createElement('img');
    // img.setAttribute('src', qr.toDataURL() );
    // img.style.width = '100%';
    // img.style.height = '100%';
    // var div = document.createElement('div');
    // div.appendChild(img);
    // div.style.width = '100%';
    // div.style.height = '100%';
    //
    // var mywindow = window.open('', '', 'left=200,top=200,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    // mywindow.document.write('<html><head><title></title>');
    // mywindow.document.write('</head><body style="padding: 0 !important;margin: 0 !important;">');
    // mywindow.document.write(div.innerHTML);
    // mywindow.document.write('</body></html>');
    //
    // mywindow.document.close(); // necessary for IE >= 10
    // mywindow.focus(); // necessary for IE >= 10*/
    // setTimeout(function () {
    //   // mywindow.print();
    //   // mywindow.close();
    // },1000);
    this.router.navigate(['/admin/library/create']);
  }

  createCanvas(qr : QRCode, cellSize = 2, margin = cellSize * 4) {
    var canvas = document.createElement('canvas');
    var size = qr.getModuleCount() * cellSize + margin * 2;
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');

    // fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // draw cells
    ctx.fillStyle = '#000000';
    for (var row = 0; row < qr.getModuleCount(); row += 1) {
      for (var col = 0; col < qr.getModuleCount(); col += 1) {
        if (qr.isDark(row, col) ) {
          ctx.fillRect(
            col * cellSize + margin,
            row * cellSize + margin,
            cellSize, cellSize);
        }
      }
    }
    return canvas;
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

}
