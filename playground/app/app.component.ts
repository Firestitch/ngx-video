import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { VideoExampleComponent } from './components/video-example/video-example.component';
import { VideoPreRollAdExampleComponent } from './components/video-pre-roll-ad-example/video-pre-roll-ad-example.component';
import { VideoPreRollAdSkipExampleComponent } from './components/video-pre-roll-ad-skip-example/video-pre-roll-ad-skip-example.component';
import { VideoMidRollAdExampleComponent } from './components/video-mid-roll-ad-example/video-mid-roll-ad-example.component';
import { VideoPostRollAdExampleComponent } from './components/video-post-roll-ad-example/video-post-roll-ad-example.component';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [FsExampleModule, VideoExampleComponent, VideoPreRollAdExampleComponent, VideoPreRollAdSkipExampleComponent, VideoMidRollAdExampleComponent, VideoPostRollAdExampleComponent]
})
export class AppComponent {
  public config = environment;
}
