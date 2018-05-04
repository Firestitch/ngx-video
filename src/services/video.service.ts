import { Injectable } from '@angular/core';

import * as Hls from 'hls.js';

import { VideoConfig } from '../models/video-config.model';
import { FsVideoConfig } from '../interfaces';
import { Scales, Controls } from '../classes';
import { secondsHumanize } from '../helpers';


@Injectable()
export class VideoService {

  // Elements & Listener handlers
  public containerTag: any;
  public videoTag: HTMLVideoElement;
  private _videoEventsHandler: EventListener;

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

  private _hls: Hls;

  constructor() {
    this._videoEventsHandler = this.videoEventsHandler.bind(this);
  }

  get hls() {
    return this._hls;
  }

  /**
   * init video config model
   * @param {FsVideoConfig} config
   */
  public initConfig(config: FsVideoConfig) {
    this.config = new VideoConfig(config);
    this._hls = new Hls(this.config.hlsConfig);
  }

  /**
   * Init player with custom design
   * @param rootElemet
   * @param targetElement
   */
  public initPlayer(rootElemet, targetElement) {
    this.containerTag = rootElemet.nativeElement.querySelector('.container');
    this.videoTag = targetElement.nativeElement;


    if (Hls.isSupported()) {
      this._hls.loadSource(this.config.source);
      this._hls.attachMedia(this.videoTag);

      ///
      this.controls = new Controls(this);
      this.scales = new Scales(this);
      ///

      this._hls.on(Hls.Events.MANIFEST_PARSED, this.onManifestParsed.bind(this));
      this._hls.on(Hls.Events.ERROR, this.onError.bind(this));
    } else if (this.videoTag.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoTag.src = this.config.source;
    }

    this.initElements();
    this.events();

    if (this.config.autoPlay) {
      this.controls.play();
    }
  }

  /**
   * Init custom design elements
   */
  public initElements() {
    this._currentTime   = this.containerTag.querySelector('#current-time') as HTMLElement;
    this._duration      = this.containerTag.querySelector('#duration') as HTMLElement;
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
  }

  /**
   * Set new source for video
   * @param {string} source
   */
  public updateSource(source: string) {
    this.config.source = source;
    this._hls.loadSource(source);
  }

  /**
   * Unsubscribe and destroy everything
   */
  public destroy() {
    this._hls.detachMedia();
    this._hls.destroy();

    this.controls.destroy();
    this.scales.destroy();

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
      case 'seeked':
      case 'play':
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
}
