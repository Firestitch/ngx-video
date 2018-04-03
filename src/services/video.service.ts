import { ElementRef, Injectable } from '@angular/core';

import * as Hls from 'hls.js';


import { VideoConfig } from '../models/video-config.model';
import { FsVideoConfig } from '../interfaces';
import { Scales } from '../classes';


@Injectable()
export class VideoService {

  public targetTag: ElementRef;
  public config: VideoConfig;

  public scales: Scales;

  private _hls: Hls;

  constructor() {
  }

  public initConfig(config: FsVideoConfig) {
    this.config = new VideoConfig(config);
    this._hls = new Hls(this.config.hlsConfig);
  }

  public initPlayer(containerElemet, targetElement) {
    this.targetTag = targetElement;

    if (Hls.isSupported()) {
      this._hls.loadSource(this.config.source);
      this._hls.attachMedia(this.targetTag.nativeElement);

      ///
      this.scales = new Scales(this._hls, containerElemet.nativeElement, this.targetTag.nativeElement);
      ///

      this._hls.on(Hls.Events.MANIFEST_PARSED, this.onManifestParsed.bind(this));
      this._hls.on(Hls.Events.ERROR, this.onError.bind(this));
      // this._hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
      //   console.log(data);
      // })
    } else if (this.targetTag.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.targetTag.nativeElement.src = this.config.source;
    }
  }

  public updateSource(source: string) {
    this.config.source = source;
    this._hls.loadSource(source);
  }

  public destroy() {
    this._hls.detachMedia();
    this._hls.destroy();
  }

  private onManifestParsed(event, data) {

  }

  private onError(event, data) {
    const errorType = data.type;
    const errorDetails = data.details;
    const errorFatal = data.fatal;

    // alert('Error video');
    console.log(errorDetails, errorFatal);
  }
}
