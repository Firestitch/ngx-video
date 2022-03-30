import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FsVideoComponent } from './components/video/video.component';
import { FsAdvertisingComponent } from './components/video/advertising/advertising.component';


@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    FsVideoComponent,
  ],
  declarations: [
    FsVideoComponent,
    FsAdvertisingComponent,
  ],
  providers: [],
})
export class FsVideoModule {
  /*static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsVideoModule,
      providers: []
    };
  }*/
}
