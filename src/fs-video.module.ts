import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsVideoComponent, FsAdvertisingComponent } from './components';
import { VideoService } from './services';
import { MatProgressSpinnerModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    FsVideoComponent,
  ],
  entryComponents: [
  ],
  declarations: [
    FsVideoComponent,
    FsAdvertisingComponent,
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
