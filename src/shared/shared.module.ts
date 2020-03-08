import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageUploaderComponent} from './image-uploader/image-uploader';
import {MatIconModule, MatTooltipModule} from '@angular/material';
import {AudioUploaderComponent} from './audio-uploader/audio-uploader.component';
import {DocUploaderComponent} from './doc-uploader/doc-uploader.component';
import {VideoUploaderComponent} from './video-uploader/video-uploader.component';
import {InfinitScrollComponent} from './component/infinite-scroll/infinit-scroll-component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule
  ],
  declarations: [
    ImageUploaderComponent,
    AudioUploaderComponent,
    DocUploaderComponent,
    VideoUploaderComponent,
    InfinitScrollComponent
  ],
  exports: [
    ImageUploaderComponent,
    AudioUploaderComponent,
    DocUploaderComponent,
    VideoUploaderComponent,
    InfinitScrollComponent
  ]
})

export class SharedModule {

}
