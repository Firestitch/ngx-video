import { Alias, Model} from 'tsmodels';
import { FsVideoConfig } from '../interfaces';

export class VideoConfig extends Model {

  @Alias() public width: string;
  @Alias() public height: string;
  @Alias() public controls: boolean;
  @Alias() public source: string;
  @Alias() public autoPlay: boolean;
  @Alias() public startLevel: number;
  @Alias() public draggable: boolean;
  @Alias() public hideControls: boolean;

  public hlsConfig = {
    capLevelToPlayerSize: true
  };


  constructor(config: FsVideoConfig | any = {}) {
    super();

    this._fromJSON(config);
    Object.assign(this.hlsConfig, config);
  }


  public _fromJSON(config: FsVideoConfig) { // FIXME
    super._fromJSON(config);

    if (config.controls === undefined || config.controls === null) {
      this.controls = true;
    }
  }

}
