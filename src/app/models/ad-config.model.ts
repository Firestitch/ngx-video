
import { FsVideoAdvertising } from '../interfaces/advertising.interface';

export class AdvertisingConfig{

  public type: 'pre' | 'mid' | 'post';
  public source: string;
  public skip: number;
  public url: string;
  public label: string;
  public start: number;
  public played = false;


  constructor(config: FsVideoAdvertising | any = {}) {
  }
}
