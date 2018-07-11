import { Component, OnInit } from '@angular/core';
import { FsVideoConfig } from '../../../../src/interfaces/';

@Component({
  selector: 'video-pre-roll-ad-skip-example',
  templateUrl: 'video-pre-roll-ad-skip-example.component.html'
})
export class VideoPreRollAdSkipExampleComponent implements OnInit {
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
          type: 'pre',
          source: 'http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8',
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
          skip: 5
        }
      ]
    }
  }
}
