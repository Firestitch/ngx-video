import { Component, OnInit } from '@angular/core';
import { FsVideoConfig } from '../../../../src/interfaces/';

@Component({
  selector: 'video-pre-roll-ad-example',
  templateUrl: 'video-pre-roll-ad-example.component.html'
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
          source: 'http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8',
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
        }
      ]
    }
  }
}
