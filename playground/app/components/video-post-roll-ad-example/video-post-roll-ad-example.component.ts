import { Component, OnInit } from '@angular/core';
import { FsVideoConfig } from '../../../../src/interfaces/';

@Component({
  selector: 'video-post-roll-ad-example',
  templateUrl: 'video-post-roll-ad-example.component.html'
})
export class VideoPostRollAdExampleComponent implements OnInit {
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
          type: 'post',
          source: 'http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8',
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
        },
      ]
    }
  }
}
