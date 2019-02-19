import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';

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
  entryComponents: [
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
