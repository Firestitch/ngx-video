import { Component, ElementRef, AfterContentInit, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { VideoService } from '../../../services/video.service';
import { FsVideoConfig } from '../../../interfaces/video-config.interface';


@Component({
  selector: 'fs-advertising',
  templateUrl: 'advertising.component.html',
  styleUrls: [ 'advertising.component.scss' ]
})
export class FsAdvertisingComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() public config: FsVideoConfig;

  @ViewChild('adVideo') public videoTag: ElementRef;

  constructor(private _el: ElementRef, private _video: VideoService) {
  }

  get width() {
    return this.config.width || 'auto';
  }

  get height() {
    return this.config.height || 'auto';
  }

  public ngOnInit() {
    // this._video.initAdvertisingConfig(this.config);
  }

  public ngAfterContentInit() {
    this._video.initAdvertisingPlayer(this._el, this.videoTag);
  }

  public ngOnDestroy() {}
}
