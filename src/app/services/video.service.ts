import { Injectable, NgZone, inject } from '@angular/core';

import { VideoConfig } from '../models/video-config.model';
import { FsVideoConfig } from '../interfaces/video-config.interface';
import { AdControl } from '../classes/ad';
import { Video } from '../classes/video';
import { AdvertisingConfig } from '../models/ad-config.model';
import { FsVideoAdvertising } from '../interfaces/advertising.interface';


@Injectable()
export class VideoService {
  private _zone = inject(NgZone);


  // Config and extra handlers
  public config: VideoConfig;
  public ads: AdvertisingConfig[];
  public player: Video;
  public adPlayer: Video;
  public adController: AdControl;


  /**
   * init video config model
   * @param config
   */
  public initConfig(config: FsVideoConfig) {
    this.config = new VideoConfig(config);
    this.ads = config.ads && config.ads.map((ad: FsVideoAdvertising) => new AdvertisingConfig(ad)) || [];
  }

  public initAdvertisingConfig(config) {
    // this.adPlayer = new Video(this._zone);
    // this.adPlayer.prefix = 'ad';
    // this.adPlayer.initConfig(this.config);
  }

  /**
   * Init player with custom design
   * @param rootElement
   * @param targetElement
   */
  public initPlayer(rootElement, targetElement) {
    this.player = new Video(this._zone);
    const config = new VideoConfig(
      Object.assign(this.config, {
        draggable: true,
        hideControls: true
      })
    );

    this.player.initConfig(config);
    this.player.initPlayer(rootElement, targetElement);
  }

  public initAdvertisingPlayer(rootElement, targetElement) {
    this.adPlayer = new Video(this._zone);
    this.adController = new AdControl(this, this.ads, this.adPlayer, this.player, this._zone);
    const config = new VideoConfig(
      Object.assign(this.config, {
        source: this.adController.queue[0].source,
        autoPlay: false,
        draggable: false,
        hideControls: false
      })
    );
    this.adPlayer.initConfig(config);
    this.adPlayer.initPlayer(rootElement, targetElement);
    this.adController.initElements();
    this.adController.startAdvertisingProcess();
  }

  public reinitializeAdPlayer(source: string) {
    this.adPlayer.updateSource(source);
    this.adPlayer.scales.setTime(0);
  }

  /**
   * Set new source for video
   * @param source
   */
  public updateSource(source: string) {
    this.player.updateSource(source);
  }

  /**
   * Unsubscribe and destroy everything
   */
  public destroy() {
    this.player && this.player.destroy();
    this.adPlayer && this.adPlayer.destroy();
    this.adController && this.adController.destroy();
  }
}
