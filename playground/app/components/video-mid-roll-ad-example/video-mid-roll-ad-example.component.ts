import { Component, OnInit } from '@angular/core';
import { FsVideoConfig } from '../../../../src/interfaces/';

@Component({
  selector: 'video-mid-roll-ad-example',
  templateUrl: 'video-mid-roll-ad-example.component.html'
})
export class VideoMidRollAdExampleComponent implements OnInit {
  public config: FsVideoConfig;

  constructor() {

  }

  public ngOnInit() {
    this.config = {
      width: '500px',
      source: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
      autoPlay: false,
      ads: [
        {
          type: 'mid',
          source: 'http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8',
          skip: 5,
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
          start: 300
        }
      ]
    }
  }
}
