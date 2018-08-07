import { Alias, Model} from 'tsmodels';
import { FsVideoConfig } from '../interfaces';
import { merge } from 'lodash';

export class VideoConfig extends Model {

  @Alias() public width: string;
  @Alias() public height: string;
  @Alias() public controls: boolean;
  @Alias() public source: string;
  @Alias() public autoPlay: boolean;
  @Alias() public startLevel: number;
  @Alias() public draggable: boolean;
  @Alias() public hideControls: boolean;
  @Alias() public hlsConfig: any;


  constructor(config: FsVideoConfig | any = {}) {
    super();
    this._fromJSON(config);
    this.hlsConfig = merge({
         capLevelToPlayerSize: true
       }, config.hlsConfig || {});
  }

  public _fromJSON(config: FsVideoConfig) { // FIXME
    super._fromJSON(config);

    if (config.controls === undefined || config.controls === null) {
      this.controls = true;
    }
  }

}
