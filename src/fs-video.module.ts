import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsVideoComponent } from './components';
import { VideoService } from './services';


@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsVideoComponent,
  ],
  entryComponents: [
  ],
  declarations: [
    FsVideoComponent,
  ],
  providers: [
    VideoService
  ],
})
export class FsVideoModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsVideoModule,
      providers: []
    };
  }
}
