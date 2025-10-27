import { Component, OnInit } from '@angular/core';
import { FsVideoConfig } from '@firestitch/video';
import { FsVideoComponent } from '../../../../src/app/components/video/video.component';

@Component({
    selector: 'video-post-roll-ad-example',
    templateUrl: 'video-post-roll-ad-example.component.html',
    standalone: true,
    imports: [FsVideoComponent]
})
export class VideoPostRollAdExampleComponent implements OnInit {
  public config: FsVideoConfig;

  constructor() {

  }

  public ngOnInit() {
    this.config = {
      source: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
      autoPlay: false,
      ads: [
        {
          type: 'post',
          source: 'https://firestitch-dev.s3.amazonaws.com/pub/media/7c0022618812bec81d5c05853db18fa0_540.m3u8',
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
        },
      ]
    }
  }
}
