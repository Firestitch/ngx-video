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
      width: '500px',
      source: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
      autoPlay: false,
      ads: [
        {
          type: 'mid',
          source: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
          skip: 3,
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
          start: 10
        },
        {
          type: 'mid',
          source: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
          start: 63
        },
        {
          type: 'post',
          source: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
          skip: 3,
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
        },
        {
          type: 'pre',
          source: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
          skip: 3,
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
        },
        {
          type: 'pre',
          source: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
          url: 'http://shopforshoes.com',
          label: 'Visit shopforshoes.com',
          skip: 5
        }
      ]
    };
  }
}
