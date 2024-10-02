import { merge } from 'lodash';
import { FsVideoConfig } from '../interfaces/video-config.interface';

export class VideoConfig {

  public width: string;
  public height: string;
  public controls: boolean;
  public source: string;
  public autoPlay: boolean;
  public startLevel: number;
  public draggable: boolean;
  public hideControls: boolean;
  public hlsConfig: any;


  constructor(config: FsVideoConfig | any = {}) {
    this.hlsConfig = merge({
         capLevelToPlayerSize: true
       }, config.hlsConfig || {});
  }

  public _fromJSON(config: FsVideoConfig) { // FIXME
    if (config.controls === undefined || config.controls === null) {
      this.controls = true;
    }
  }

}
