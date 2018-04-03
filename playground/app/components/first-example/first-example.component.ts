import { Component, OnInit } from '@angular/core';
import { FsVideoConfig } from '../../../../src/interfaces';

@Component({
  selector: 'first-example',
  templateUrl: 'first-example.component.html'
})
export class FirstExampleComponent implements OnInit {
  public config: FsVideoConfig;

  public ngOnInit() {
    this.config = {
      width: '500px',
      source: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
      autoPlay: false
    };
  }
}
