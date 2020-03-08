import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../shared/common/common.service';

@Component({
  selector: 'app-auth-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private commonService: CommonService) {
  }
  passType = 'password'
  loading = false;
  formGroup: FormGroup;

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      pass: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
    });
  }

  login() {
    const jp = {
      username: this.formGroup.get('username').value,
      password: this.formGroup.get('pass').value,
      grant_type: 'password'
      };
    let sp = Object.keys(jp).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(jp[key]);
    }).join('&');
    this.loading = true;
    this.http.post<any>('http://37.152.180.194:9000/oauth/token', sp, {headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ZW5nX2FwcDplbmdfYXBw'
      }})
      .subscribe(
        (val) => {
          localStorage.setItem('token', val.access_token);
          localStorage.setItem('user', JSON.stringify(val.user));
          this.commonService.setUser(val.user);
          this.commonService.locateFirstPage();
          this.loading = false;
          this.commonService.showMessage('خوش آمدید.', 'success-msg');
        },
        response => {
          this.commonService.handleError(response);
          this.loading = false;
        });
  }
}
