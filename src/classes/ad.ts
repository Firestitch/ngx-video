import { VideoService } from '../services/video.service';
import { AdvertisingConfig } from '../models/ad-config.model';
import { NgZone } from '@angular/core';
import { fractionOfNumber } from '../helpers/fraction-of-number';

import { Video } from './video';

export class AdControl {

  private _advertisingPoints = document.createElement('div');

  // buttons
  private _linkContainer: HTMLElement;
  private _linkLabel: HTMLElement;
  private _linkUrl: HTMLLinkElement;
  private _adStartSoonContainer: HTMLElement;
  private _skipAdvertising: HTMLElement;
  private _skipSeconds: HTMLElement;
  private _skipSecondsContainer: HTMLElement;

  // arrays of advertising by types;
  public before: AdvertisingConfig[];
  public after: AdvertisingConfig[];
  public middle: AdvertisingConfig[];

  public queue: AdvertisingConfig[] = [];

  private _adVideoEndedHandler: EventListener;
  private _skipAdHandler: EventListener;
  private _videoEndedHandler: EventListener;
  private _videoDurationChangedHandler: EventListener;

  private _checkNotificationAdInterval;
  private _startingSoonInterval;
  private _skipperInterval;

  private _notifySec = 3;
  private _counter = 3;

  constructor(private _service: VideoService,
              private _ads: AdvertisingConfig[],
              private _adPlayer: Video,
              private _player: Video,
              private _zone: NgZone) {

    this.initAd();
  }

  public initElements() {
    this._adStartSoonContainer  = this._player.containerTag.querySelector('#ad-start-soon');
    this._linkContainer         = this._adPlayer.containerTag.querySelector('#ad-link-container');
    this._linkLabel             = this._adPlayer.containerTag.querySelector('#ad-link-label');
    this._linkUrl               = this._adPlayer.containerTag.querySelector('#ad-link');
    this._skipAdvertising       = this._adPlayer.containerTag.querySelector('#ad-skip');
    this._skipSeconds           = this._adPlayer.containerTag.querySelector('#ad-can-skip-seconds');
    this._skipSecondsContainer  = this._adPlayer.containerTag.querySelector('#ad-can-skip');

    this.events();
  }

  /**
   * Listeners for events
   */
  public events() {
    this._adVideoEndedHandler = this.videoEnded.bind(this);
    this._skipAdHandler = this.videoEnded.bind(this);
    this._videoEndedHandler = this.playerEnded.bind(this);
    this._videoDurationChangedHandler = this.setAdPoints.bind(this);

    this._adPlayer.videoTag.addEventListener('ended', this._adVideoEndedHandler);
    this._skipAdvertising.addEventListener('click', this._skipAdHandler);
    this._player.videoTag.addEventListener('durationchange', this._videoDurationChangedHandler);
    this._player.videoTag.addEventListener('ended', this._videoEndedHandler);
  }

  /**
   * Update link and label for advertising link
   * @param {string} label
   * @param {string} link
   */
  public updateLinkButton(label: string, link: string) {
    this._linkLabel.innerText = label;
    this._linkUrl.href = link;
  }

  /**
   * Init and sorting advertising by type
   */
  public initAd() {
    this.before = this._ads.filter((ad) => ad.type === 'pre' );
    this.after = this._ads.filter((ad) => ad.type === 'post');
    this.middle = this._ads.filter((ad) => ad.type === 'mid');

    this.middle.sort((a, b) => a.start - b.start);

    this.queue.push(...this.before, ...this.middle, ...this.after);
  }

  /**
   * Depends on type start ad immediately or not
   */
  public startAdvertisingProcess() {
    if (this.before.length)  {
      this.startAdvertising();
    } else if (this.middle.length) {
      this.createNotificationChecking();
    }
  }

  /**
   * Stop and hide main video
   * Start the first ad-video in queue
   */
  public startAdvertising() {
    this._player.controls.pause();
    this._player.containerTag.classList.add('hidden');
    this._adPlayer.containerTag.classList.remove('hidden');
    this._linkContainer.classList.remove('hidden');
    this._adPlayer.videoTag.play();

    if (this.queue[0].skip) {
      this.skipperTimer();
      this._skipSecondsContainer.classList.remove('hidden');
    }

    this.updateLinkButton(this.queue[0].label, this.queue[0].url);
  }

  /**
   * Condition for set advertising points on the scale of main video
   */
  public setAdPoints() {
    if (this._player.videoTag.duration && this.middle.length && !this._advertisingPoints.hasChildNodes()) {
      this.createPointsOnScale();
    }
  }

  /**
   * Set advertising points on the scale of main video
   */
  public createPointsOnScale() {
    const progressContainerElem = this._player.scales.progressContainerElem;
    this._advertisingPoints.classList.add('ad-stop-points');
    progressContainerElem.appendChild(this._advertisingPoints);

    this.middle.forEach((advertising, index) => {
      const newPoint = document.createElement('div');
      newPoint.classList.add('ad-point');
      newPoint.setAttribute('id', `${advertising.type}-${index}`);
      this._advertisingPoints.appendChild(newPoint);

      newPoint.style.left = fractionOfNumber(advertising.start, this._player.videoTag.duration) * 100 + '%';
    })
  }

  /**
   * When main video was ended
   */
  public playerEnded() {
    if (this.after.length) {
      this.startAdvertising();
    }
  }

  /**
   * Initialize a new ad-video or interval after prev video was ended
   */
  private videoEnded() {
    this.queue.shift();

    this.hideAdvertising();
    if (!this.queue.length) { return }
    if (this.queue[0].type === 'pre') {
      this._service.reinitializeAdPlayer(this.queue[0].source);
      this.startAdvertising();
    } else if (this.queue[0].type === 'post' && this._player.videoTag.ended) {
      this._service.reinitializeAdPlayer(this.queue[0].source);
      this.startAdvertising();
    } else if (this.queue[0].type === 'mid') {
      this.createNotificationChecking();
    }
  }

  /**
   * Stop ad-video and start main video
   */
  private hideAdvertising() {
    this._skipAdvertising.classList.add('hidden');
    this._linkContainer.classList.add('hidden');
    this._skipSeconds.innerText = '-';
    this._player.containerTag.classList.remove('hidden');
    this._adPlayer.containerTag.classList.add('hidden');
    // this._adPlayer.controls.pause();
    this._player.controls.play();
  }

  /**
   * For checking middle advertising and show 'Ad start soon' div
   */
  private createNotificationChecking() {
    this._checkNotificationAdInterval = setInterval(this.checkNotification.bind(this), 1000);
  }

  /**
   * Check it's time for notification or not
   */
  private checkNotification() {
    const currentTime = Math.floor(this._player.videoTag.currentTime);
    const adIndex = this.queue.findIndex((a) => a.start === currentTime + this._notifySec);
    if (adIndex !== -1) {
      this.queue.slice(adIndex);
      clearInterval(this._checkNotificationAdInterval);
      this._adStartSoonContainer.classList.remove('hidden');
      this.startingSoonInterval();
    }
  }

  /**
   * For countdown 'Start soon' btn
   */
  private startingSoonInterval() {
    this._startingSoonInterval = setInterval(this.startingSoonCountDown.bind(this),  1000);
  }

  /**
   * Count down 'Start soon'
   */
  private startingSoonCountDown() {
    if (!this._service.player.playing) { return; } // if main video is paused

    if (this._counter === 0) {
      clearInterval(this._startingSoonInterval);
      this._adStartSoonContainer.classList.add('hidden');
      this._linkContainer.classList.remove('hidden');
      this._player.controls.pause();
      this._service.reinitializeAdPlayer(this.queue[0].source);
      this.startAdvertising();
      this._counter = this._notifySec;
    }
    this._counter--;
  }

  /**
   * Skip advertising timer
   */
  private skipperTimer() {
    let counter = this.queue[0].skip;
    this._skipperInterval = setInterval(() => {
      this._skipSeconds.innerText = String(counter);
      if (counter === 0) {
        clearInterval(this._skipperInterval);
        this._skipSecondsContainer.classList.add('hidden');
        this._skipAdvertising.classList.remove('hidden');
      }
      counter--;
    },  1000);
  }


  public destroy() {
    this._adPlayer.videoTag.removeEventListener('ended', this._adVideoEndedHandler);
    this._skipAdvertising.removeEventListener('click', this._skipAdHandler);
    this._player.videoTag.removeEventListener('durationchange', this._videoDurationChangedHandler);
    this._player.videoTag.removeEventListener('ended', this._videoEndedHandler);
  }
}
