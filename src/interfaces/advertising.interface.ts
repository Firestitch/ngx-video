export interface FsVideoAdvertising {
  type: 'pre' | 'mid' | 'post';
  source: string;
  skip?: number;
  url: string;
  label: string;
  start?: number;
}
