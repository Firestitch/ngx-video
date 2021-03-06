import { NgZone } from '@angular/core';

import * as Hls from 'hls.js';

import { VideoConfig } from '../models/video-config.model';
import { FsVideoConfig } from '../interfaces/video-config.interface';
import { Scales } from '../classes/scales/scales';
import { Controls } from '../classes/controls';
import { secondsHumanize } from '../helpers/seconds-humanize';

export class Video {

  // Elements & Listener handlers
  public containerTag: any;
  public videoTag: HTMLVideoElement;
  private _videoEventsHandler: EventListener;
  private _videoControlsHandler: EventListener;
  private _leaveVideoHandler: EventListener;

  // Time
  private _currentTime: HTMLElement;
  private _duration: HTMLElement;

  // Config and extra handlers
  public config: VideoConfig;
  public scales: Scales;
  public controls: Controls;

  // States
  public playing = false;
  public isFullscreenMode = false;
  public muted = false;
  public userActivity = false;

  private _hls: Hls;

  // Intervals for checking user activity
  private _inactivityInterval: any;
  private _checkActivityInterval: any;

  constructor(private _zone: NgZone) {
    this._videoEventsHandler = this.videoEventsHandler.bind(this);
    this._videoControlsHandler = this.videoControlsHandler.bind(this);
    this._leaveVideoHandler = this.videoLeaveHandler.bind(this);
  }

  get hls() {
    return this._hls;
  }

  /**
   * init video config model
   * @param config
   */
  public initConfig(config: VideoConfig) {
    this.config = new VideoConfig(config);
    // buffering experiments
    // this.config.hlsConfig.maxMaxBufferLength = 1;
    // this.config.hlsConfig.maxBufferLength = 1;
    // this.config.hlsConfig.maxBufferSize = 1;
    // this.config.hlsConfig.autoStartLoad = true;
    this._hls = new Hls(this.config.hlsConfig);
  }

  /**
   * Init player with custom design
   * @param rootElement
   * @param targetElement
   */
  public initPlayer(rootElement, targetElement) {
    this.containerTag = rootElement.nativeElement.querySelector('.container');
    this.videoTag = targetElement.nativeElement;
    ///
    this.controls = new Controls(this, this._zone, this.config.hideControls);
    this.scales = new Scales(this, this._zone, this.config.draggable);
    ///

    if (Hls.isSupported()) {
      this.updateSource(this.config.source);

      this._hls.on(Hls.Events.MANIFEST_PARSED, this.onManifestParsed.bind(this));
      this._hls.on(Hls.Events.ERROR, this.onError.bind(this));
    } else if (this.videoTag.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoTag.src = this.config.source;
    }

    this.initElements();
    this.events();
    this.config.hideControls && this.checkUserActivity();

    if (this.config.autoPlay) {
      this.controls.play();
    }
  }

  /**
   * Init custom design elements
   */
  public initElements() {
    this._currentTime = this.containerTag.querySelector(`#current-time`) as HTMLElement;
    this._duration    = this.containerTag.querySelector(`#duration`) as HTMLElement;
  }

  /**
   * Update current time text with humanization
   */
  public updateCurrentTime() {
    this._currentTime.innerText = secondsHumanize(this.videoTag.currentTime);
  }

  /**
   * Subscribing to video tag events and assign handler
   */
  public events() {
    // Video events
    this.videoTag.addEventListener('click', this._videoEventsHandler);
    this.videoTag.addEventListener('seeking', this._videoEventsHandler);
    this.videoTag.addEventListener('seeked', this._videoEventsHandler);
    this.videoTag.addEventListener('play', this._videoEventsHandler);
    this.videoTag.addEventListener('canplay', this._videoEventsHandler);
    this.videoTag.addEventListener('canplaythrough', this._videoEventsHandler);
    this.videoTag.addEventListener('ended', this._videoEventsHandler);
    this.videoTag.addEventListener('playing', this._videoEventsHandler);
    this.videoTag.addEventListener('loadedmetadata', this._videoEventsHandler);
    this.videoTag.addEventListener('loadeddata', this._videoEventsHandler);
    this.videoTag.addEventListener('durationchange', this._videoEventsHandler);

    this._zone.runOutsideAngular(() => {
      this.containerTag.addEventListener('mousemove', this._videoControlsHandler);
      this.containerTag.addEventListener('mouseout', this._leaveVideoHandler);
    });
  }

  /**
   * Set new source for video
   * @param source
   */
  public updateSource(source: string) {
    this.config.source = source;
    this._hls.loadSource(source);
    this._hls.attachMedia(this.videoTag);
  }

  /**
   *  Set a variable that can be picked up by a js interval that’s running at a controlled pace.
   *  Using a technique written about by John Resig. (https://johnresig.com/blog/learning-from-twitter/)
   */
  public checkUserActivity() {
    this._checkActivityInterval = setInterval(() => {
      if (this.videoTag.paused) {
        clearTimeout(this._inactivityInterval);
      }

      // Check to see if the mouse has been moved
      if (this.userActivity && !this.videoTag.paused) {
        this.userActivity = false;
        clearTimeout(this._inactivityInterval);

        this._inactivityInterval = setTimeout(() => {
          // Protect against the case where the inactivity timeout can trigger
          // before the next user activity is picked up  by the activityCheck loop.
          if (!this.userActivity) {
            this.controls.hideControls();
          }
        }, 3000);

      }
    }, 250);
  }

  public stopCheckingUserActivity() {
    clearInterval(this._checkActivityInterval);
    clearTimeout(this._inactivityInterval);
  }
  /**
   * Unsubscribe and destroy everything
   */
  public destroy() {
    this._hls.detachMedia();
    this._hls.destroy();

    if (this.controls) {
      this.controls.destroy();
    }

    if (this.scales) {
      this.scales.destroy();
    }

    this.controls = null;
    this.scales = null;

    this.videoTag.removeEventListener('seeking', this._videoEventsHandler);
    this.videoTag.removeEventListener('seeked', this._videoEventsHandler);
    this.videoTag.removeEventListener('play', this._videoEventsHandler);
    this.videoTag.removeEventListener('canplay', this._videoEventsHandler);
    this.videoTag.removeEventListener('canplaythrough', this._videoEventsHandler);
    this.videoTag.removeEventListener('ended', this._videoEventsHandler);
    this.videoTag.removeEventListener('playing', this._videoEventsHandler);
    this.videoTag.removeEventListener('loadedmetadata', this._videoEventsHandler);
    this.videoTag.removeEventListener('loadeddata', this._videoEventsHandler);
    this.videoTag.removeEventListener('durationchange', this._videoEventsHandler);

    this.containerTag.removeEventListener('mousemove', this._videoControlsHandler);
    this.containerTag.removeEventListener('mouseout', this._leaveVideoHandler);
    this.stopCheckingUserActivity();
  }

  /**
   *
   * @param event
   * @param data
   */
  private onManifestParsed(event, data) {

  }

  /**
   * On error
   * @param event
   * @param data
   */
  private onError(event, data) {
    const errorType = data.type;
    const errorDetails = data.details;
    const errorFatal = data.fatal;

    // alert('Error video');
    console.log(errorDetails, errorFatal);
  }

  /**
   * Handler for video tag
   * @param event
   */
  private videoEventsHandler(event) {
    switch (event.type) {
      case 'durationchange': {
        this._duration.innerText = secondsHumanize(this.videoTag.duration)
      } break;

      case 'loadedmetadata':
      case 'loadeddata':
      case 'canplay':
      case 'canplaythrough':
      case 'ended':
      case 'seeking':
      case 'seeked': {
        break;
      }
      case 'play': {

        if (!this.config.hlsConfig.autoStartLoad) {
          this._hls.startLoad();
        }

        break;
      }
      case 'playing': {
        this._currentTime.innerText = secondsHumanize(this.videoTag.currentTime);
      } break;
      case 'click': {
        if (this.playing) {
          this.controls.pause();
        } else {
          this.controls.play();
        }
      } break;
    }
  }

  /**
   * Detect user activity and show controls;
   */
  private videoControlsHandler() {
    this.userActivity = true;
    this.controls.showControls();
  }

  /**
   * Detect when user isn't on player and hide controls
   */
  private videoLeaveHandler(event) {
    if (this.playing) {
      this.controls.hideControls();
    }
  }
}
