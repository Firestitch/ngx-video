import { Component, OnInit } from '@angular/core';
import { FsVideoConfig } from '@firestitch/video';
import { FsVideoComponent } from '../../../../src/app/components/video/video.component';

@Component({
    selector: 'video-mid-roll-ad-example',
    templateUrl: 'video-mid-roll-ad-example.component.html',
    standalone: true,
    imports: [FsVideoComponent]
})
export class VideoMidRollAdExampleComponent implements OnInit {
  public config: FsVideoConfig;

  constructor() {

  }

  public ngOnInit() {
    this.config = {
      source: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
      autoPlay: false,
      ads: [
        {
          type: 'mid',
          source: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
          skip: 5,
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
          start: 300
        }
      ]
    }
  }
}
