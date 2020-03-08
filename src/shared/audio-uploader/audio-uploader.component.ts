import {
  Component, Input, OnInit, ViewChild,
  AfterViewInit,
  ElementRef, Output, EventEmitter
} from '@angular/core';
import {ImageCompressService} from 'ng2-image-compress';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

@Component({
  selector: 'app-audio-uploader',
  templateUrl: './audio-uploader-component.html',
  styleUrls: ['./audio-uploader.component.scss']
})

export class AudioUploaderComponent implements OnInit {

  @ViewChild('file', {static: false}) file: ElementRef;

  @Input() title: string;
  @Input() width = '100%';
  @Input() height = '100%';
  @Input() addIcon: string;
  @Input() initImage: string;
  @Input() defaultStyle = false;
  @Input() addLayout = false;
  @Input() id: any;
  @Input() isValidRequired = true;
  // exm: ['png', 'jpg', 'gif']
  @Input() allowedType: Array<string> = [];
  @Output() audioFile = new EventEmitter<object>();
  audio = undefined;
  bgImage = undefined;
  invalid: boolean;
  isLoading = false;
  percentage = 0;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  isValidFile(): boolean {
    const audio = this.file.nativeElement.files[0];
    console.log(audio);
    let canUpload = true;
    this.invalid = false;
    console.log(this.allowedType.length);
    if (this.allowedType.length) {
      console.log('here 1');
      canUpload = false;
      for (const type of this.allowedType) {
        if (audio.type.indexOf(type) > 0) {
          canUpload = true;
        }
      }
      if (!canUpload) {
        this.invalid = true;
        return false;
      }
    } else {
      return true;
    }
  }

  openInputFile() {
    const fileToSend = this.file.nativeElement.files[0];
    if (this.isValidFile()) {
      console.log('here 2');
      this.audio = fileToSend;
    } else {
      return;
    }
    this.isLoading = true;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6Im9taWQuamF2YWhlcmkxOTg3QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdXNlcmRhdGEiOiIzMDU0OSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdmVyc2lvbiI6IjIiLCJpc3MiOiJodHRwOi8vYXBpLnBhcnNhc3BhY2UuY29tLyIsImF1ZCI6IkFueSIsImV4cCI6MTYwMDI2OTMwOCwibmJmIjoxNTY4NzMzMzA4fQ.q1uHWk_y6HCBp5n2T5xCqMQeH1vaiY3z2Rblc3OmSsM'
      }),
      reportProgress: true,
    };
    const url = 'https://api.parsaspace.com/v1/files/upload';
    const formData = new FormData();
    formData.append('domain', 'sandogh.parsaspace.com');
    formData.append('file', fileToSend, fileToSend.name);
    const request = new HttpRequest('POST', url, formData, httpOptions);
    this.http.request(request)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          this.percentage = percentDone;
          console.log(`File is ${percentDone}% uploaded.`);
        } else if (event instanceof HttpResponse) {
          console.log('File is completely uploaded!');
          console.log(event);
          if (event.body) {
            // @ts-ignore
            this.bgImage = event.body.downloadLink;
            // @ts-ignore
            this.audioFile.emit({
              // @ts-ignore
              link: event.body.downloadLink,
              id: this.id
            });
            this.isLoading = false;
          }
        }
      });
  }

  removeImage() {
    const params = new HttpParams({
      fromObject: {
        domain: 'sandogh.parsaspace.com',
        path: this.bgImage.substring(this.bgImage.lastIndexOf('/') + 1),
      }
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6Im9taWQuamF2YWhlcmkxOTg3QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdXNlcmRhdGEiOiIzMDU0OSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdmVyc2lvbiI6IjIiLCJpc3MiOiJodHRwOi8vYXBpLnBhcnNhc3BhY2UuY29tLyIsImF1ZCI6IkFueSIsImV4cCI6MTYwMDI2OTMwOCwibmJmIjoxNTY4NzMzMzA4fQ.q1uHWk_y6HCBp5n2T5xCqMQeH1vaiY3z2Rblc3OmSsM'
      })
    };
    this.http.post<any>('https://api.parsaspace.com/v1/files/remove', params, httpOptions)
      .subscribe(
        (val) => {
          this.audio = undefined;
          this.bgImage = undefined;
          this.audioFile.emit({
            link: undefined,
            id: this.id
          });
        },
        response => {
          console.log(response);
        });
  }

  dataURItoBlob(dataURI, suffix) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: suffix});
  }

  generateFileName(suffix) {
    const date = new Date().valueOf();
    let text = '';
    const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
    }
    return date + '-' + text + '.' + suffix;
  }
}
