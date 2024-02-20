import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FsExampleModule } from '@firestitch/example';
import { FsVideoModule } from '@firestitch/video';
import { FsMessageModule } from '@firestitch/message';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';
import {
  VideoExampleComponent,
  VideoPostRollAdExampleComponent,
  VideoMidRollAdExampleComponent,
  VideoPreRollAdExampleComponent,
  VideoPreRollAdSkipExampleComponent } from './components/';


@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        FsVideoModule,
        BrowserAnimationsModule,
        AppMaterialModule,
        FormsModule,
        FsExampleModule.forRoot(),
        ToastrModule.forRoot({ preventDuplicates: true }),
        FsMessageModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        VideoExampleComponent,
        VideoPostRollAdExampleComponent,
        VideoMidRollAdExampleComponent,
        VideoPreRollAdExampleComponent,
        VideoPreRollAdSkipExampleComponent,
    ],
    providers: []
})
export class PlaygroundModule {
}
