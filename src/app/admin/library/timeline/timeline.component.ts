import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-timeline-component',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {

  loading = false;
  productSizeId;

  constructor(private http: HttpClient,
              private route: ActivatedRoute) {
    this.productSizeId = route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.loading = true;
    const param = {
      productSize: {
        id: this.productSizeId
      }
    };
    this.http.post('http://127.0.0.1:9000/v1/shop/timeline/list', param, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .subscribe(
        val => {
          console.log(val);
        }
      ),
      err => {
        console.log(err);
      };
  }
}
