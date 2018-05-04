import './../tools/assets/playground.scss';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FsExampleModule } from '@firestitch/example';

import { FsVideoModule } from '../src';
import { AppMaterialModule } from './app/material.module';
import { FsExamplesComponent } from '../tools/components/examples/examples.component';
import { VideoExampleComponent } from './app/components/video-example/video-example.component';


@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsVideoModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule,
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,
    VideoExampleComponent,
    FsExamplesComponent
  ],
  providers: [
  ],
})
export class PlaygroundModule {
}
