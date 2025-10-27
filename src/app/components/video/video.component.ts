import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { VideoService } from '../../services/video.service';
import { FsVideoConfig } from '../../interfaces/video-config.interface';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FsAdvertisingComponent } from './advertising/advertising.component';

@Component({
    selector: 'fs-video',
    templateUrl: 'video.component.html',
    styleUrls: ['video.component.scss'],
    providers: [VideoService,],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatProgressSpinner, FsAdvertisingComponent],
})
export class FsVideoComponent implements OnInit, OnDestroy {

  @Input() public config: FsVideoConfig;

  @ViewChild('video', { static: true }) public videoTag: ElementRef;

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
