import { FsVideoAdvertising } from './advertising.interface';

export interface FsVideoConfig {
  width?: string;
  height?: string;
  controls?: boolean;
  source?: string;
  autoPlay?: boolean;
  startLevel?: boolean;
  ads?: FsVideoAdvertising[];
}
