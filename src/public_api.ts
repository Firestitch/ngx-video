/*
 * Public API Surface of fs-menu
 */

// Modules
export { FsVideoModule } from './app/fs-video.module';

// Components
export { FsVideoComponent } from './app/components/video/video.component';
export { FsAdvertisingComponent } from './app/components/video/advertising/advertising.component';

// Classes
export { AdControl } from './app/classes/ad';
export { Controls } from './app/classes/controls';
export { Video } from './app/classes/video';

export { Scales } from './app/classes/scales/scales';
export { BufferInterval } from './app/classes/scales/buffer-interval';

// Models
export { AdvertisingConfig } from './app/models/ad-config.model';
export { VideoConfig } from './app/models/video-config.model';

// Interfaces
export { FsVideoConfig } from './app/interfaces/video-config.interface';
export { FsVideoAdvertising } from './app/interfaces/advertising.interface';
