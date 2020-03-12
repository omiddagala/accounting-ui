import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-timeline-component',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {

  loading = false;
  productSizeId;
  timeline: any;

  constructor(private http: HttpClient,
              private route: ActivatedRoute) {
    this.productSizeId = route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getData();
  }

  showJalaliDate(date) {
    // console.log(date)
    moment.locale('fa', { useGregorianParser: true });
    date = moment(date).format();
    let m = moment.from(date, 'fa', 'YYYY/MM/DDTHH:mmZ');
    console.log(m)
    // console.log(m.local('fa').format('hh:mm')
    return m.local('fa').format('jYYYY/jMM/jDD hh:mm');
  }

  getData() {
    this.loading = true;
    const param = {
      id: this.productSizeId
    };
    console.log(param);
    this.http.post('http://127.0.0.1:9000/v1/shop/timeline/list', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        val => {
          console.log(val);
          this.loading = false;
          this.timeline = val
        }
      ),
      err => {
        console.log(err);
      };
  }
}
