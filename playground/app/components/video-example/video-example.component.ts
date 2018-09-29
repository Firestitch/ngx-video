import { Component, OnInit } from '@angular/core';
import { FsVideoConfig } from '../../../../src/interfaces';

@Component({
  selector: 'video-example',
  templateUrl: 'video-example.component.html'
})
export class VideoExampleComponent implements OnInit {
  public config: FsVideoConfig;

  public ngOnInit() {
    this.config = {
      source: 'https://firestitch-dev.s3.amazonaws.com/pub/media/7c0022618812bec81d5c05853db18fa0_540.m3u8',
      autoPlay: false,
      hlsConfig: { autoStartLoad: false }
    };
  }
}
