import { Component, OnInit } from '@angular/core';
import { FsVideoConfig } from '@firestitch/video';
import { FsVideoComponent } from '../../../../src/app/components/video/video.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'video-pre-roll-ad-example',
    templateUrl: 'video-pre-roll-ad-example.component.html',
    standalone: true,
    imports: [FsVideoComponent, MatButton]
})
export class VideoPreRollAdExampleComponent implements OnInit {
  public config: FsVideoConfig;
  public enabled = false;

  constructor() {

  }

  toggle() {
    this.enabled = !this.enabled;
  }

  public ngOnInit() {
    this.config = {
      source: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
      autoPlay: false,
      ads: [
        {
          type: 'pre',
          source: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
        }
      ]
    }
  }
}
