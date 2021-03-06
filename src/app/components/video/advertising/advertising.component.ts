import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { VideoService } from '../../../services/video.service';
import { FsVideoConfig } from '../../../interfaces/video-config.interface';


@Component({
  selector: 'fs-advertising',
  templateUrl: 'advertising.component.html',
  styleUrls: [ 'advertising.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAdvertisingComponent implements OnInit, OnDestroy {
  @Input() public config: FsVideoConfig;

  @ViewChild('adVideo', { static: true }) public videoTag: ElementRef;

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
    this._video.initAdvertisingPlayer(this._el, this.videoTag);
  }

  public ngOnDestroy() {}
}
