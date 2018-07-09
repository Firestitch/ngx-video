import { Alias, Model } from 'tsmodels';
import { FsVideoAdvertising } from '../interfaces/advertising.interface';

export class AdvertisingConfig extends Model {

  @Alias() public type: 'pre' | 'mid' | 'post';
  @Alias() public source: string;
  @Alias() public skip: number;
  @Alias() public url: string;
  @Alias() public label: string;
  @Alias() public start: number;
  @Alias() public played = false;


  constructor(config: FsVideoAdvertising | any = {}) {
    super();
    super._fromJSON(config);

  }
}
