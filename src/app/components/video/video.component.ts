import { AfterContentInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { FsVideoConfig } from '../../interfaces/video-config.interface';

@Component({
  selector: 'fs-video',
  templateUrl: 'video.component.html',
  styleUrls: [ 'video.component.scss' ],
  providers: [ VideoService, ],
})
export class FsVideoComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() public config: FsVideoConfig;

  @ViewChild('video') public videoTag: ElementRef;

  public buffers = [];

  constructor(private _el: ElementRef, private _video: VideoService) {
  }

  get width() {
    return this.config.width || 'auto';
  }

  get height() {
    return this.config.height || 'auto';
  }

  public ngOnInit() {
    this._video.initConfig(this.config);
  }

  public ngAfterContentInit() {
    this._video.initPlayer(this._el, this.videoTag);
  }

  public ngOnDestroy() {
    this.destroy();
  }

  public updateSource(source: string) {
    this._video.updateSource(source);
  }

  public destroy() {
    this._video.destroy();
  }
}
