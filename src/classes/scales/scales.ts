import * as Hls from 'hls.js';
import { fractionOfNumber, scaleX } from '../../helpers';

import { BufferInterval } from './buffer-interval';
import { secondsHumanize } from '../../helpers/seconds-humanize';
import { NgZone } from '@angular/core';
import { Video } from '../video';

export class Scales {

  public buffers: BufferInterval[] = [];

  private _progressContainerElem: HTMLElement;
  private _playProgressElem: HTMLElement;
  private _buffersContainerElem: HTMLElement;
  private _movingCurrentTimeLabel: HTMLElement;
  private _durationElem: HTMLInputElement;

  private _duration: number;
  private _time: number;
  private _bufferCheckInterval;
  private _onFragBufferedCallback;

  private changeCurrentTimeByDraggingListener;
  private changeCurrentTimeByDraggingEndListener;

  constructor(private _player: Video,
              private _zone: NgZone,
              private _isDraggable = true) {
    this._onFragBufferedCallback = this.onFragBuffered.bind(this);

    this._progressContainerElem = this._player.containerTag.querySelector(`#progress`);
    this._playProgressElem = this._player.containerTag.querySelector(`#play-progress`);
    this._buffersContainerElem = this._player.containerTag.querySelector(`#buffers`);
    this._movingCurrentTimeLabel = this._player.containerTag.querySelector(`#play-current-time-label`);
    this._durationElem = this._player.containerTag.querySelector(`#duration-bar input`);

    // !this._isDraggable && this._durationElem.setAttribute('disabled', 'true');

    this.subscribe();
    this.events();
  }

  get progressContainerElem() {
    return this._progressContainerElem;
  }

  /**
   * Update current time after buffer update
   * @param {number} value
   */
  public setTime(value: number) {
    this._time = value;

    const scaleTo = fractionOfNumber(this._time, this._duration);
    this._playProgressElem.setAttribute('style', scaleX(scaleTo));

    const currentTimePos = fractionOfNumber(this._player.videoTag.currentTime, this._duration) * 100;
    this._durationElem.value = String(currentTimePos);

    this._player.updateCurrentTime();
  }

  /**
   * Subscribe to player events
   */
  private subscribe() {
    this._player.hls.on(Hls.Events.FRAG_BUFFERED, this._onFragBufferedCallback)
  }

  /**
   * Subscribe to video tag events
   */
  private events() {
    // no subscription if we don't need drag
    if (!this._isDraggable) {
      return;
    }

    this.changeCurrentTimeByDraggingListener = this.changeCurrentTime.bind(this);
    this.changeCurrentTimeByDraggingEndListener = this.hideTimeLabel.bind(this);
    this._durationElem.addEventListener('input', this.changeCurrentTimeByDraggingListener);
    this._durationElem.addEventListener('change', this.changeCurrentTimeByDraggingEndListener);
  }

  /**
   * Changing current time by click event or dragging event
   * @param event
   */
  private changeCurrentTime(event) {
    event.preventDefault();
    event.stopPropagation();
    const currentTimePos = +this._durationElem.value;

    const target = currentTimePos / 100 * this._duration;
    this._player.videoTag.currentTime = target;

    this._player.userActivity = true;
    this.showTimeLabel();
  }

  /**
   * Show time label above current time point
   */
  private showTimeLabel() {
    const currentTimePos = +this._durationElem.value;

    const pointTimeBound = this._movingCurrentTimeLabel.getBoundingClientRect();
    const progressBound = this._progressContainerElem.getBoundingClientRect();
    const halfOfTimeWidth = fractionOfNumber(pointTimeBound.width / 2, progressBound.width) * 100;

    this._movingCurrentTimeLabel.hidden = false;
    this._movingCurrentTimeLabel.innerText = secondsHumanize(this._player.videoTag.currentTime);
    this._movingCurrentTimeLabel.style.left = `${ currentTimePos - halfOfTimeWidth / 2 }%`;
  }

  /**
   * Hide time label above current time point
   */
  private hideTimeLabel() {
    this._movingCurrentTimeLabel.hidden = true;
  }

  /**
   * React on buffers was changed
   * @param event
   * @param data
   */
  private onFragBuffered(event, data) {
    if (!this._bufferCheckInterval) {
      this._bufferCheckInterval = setInterval(this.checkBuffer.bind(this), 100);
    }
  }

  /**
   * Check and update buffers
   */
  private checkBuffer() {
    this._duration = this._player.videoTag.duration;
    this.setTime(this._player.videoTag.currentTime);

    const bufferedRanges = this._player.videoTag.buffered;

    // Create new buffer interval
    if (this.buffers.length < bufferedRanges.length) {
      const buffer = new BufferInterval();
      this._buffersContainerElem.appendChild(buffer.element);

      this.buffers.push(buffer);
    }

    /**
     * If we have situation when 2 buffers has been overlapped
     * Than we need to remove last buffer
     */
    if (this.buffers.length > bufferedRanges.length) {
      this.buffers.forEach((buffer, index) => {
        const nextBuffer = this.buffers[index + 1];
        if (nextBuffer) {
          if (buffer.end >= nextBuffer.start) {
            this.buffers.splice(index + 1, 1);
            nextBuffer.destroy();
          }
        }
      });
    }

    // Update buffers
    for (let i = 0; i < bufferedRanges.length; i++) {
      const start = bufferedRanges.start(i);
      const end = bufferedRanges.end(i);
      const buffer = this.buffers[i];
      buffer.updateDimensions(start, end, this._duration);
    }
  }

  /**
   * Destroy everything
   */
  public destroy() {
    this._player.hls.off(Hls.Events.FRAG_BUFFERED, this._onFragBufferedCallback);

    if (this.changeCurrentTimeByDraggingListener && this.changeCurrentTimeByDraggingEndListener) {
      this._durationElem.removeEventListener('input', this.changeCurrentTimeByDraggingListener);
      this._durationElem.removeEventListener('change', this.changeCurrentTimeByDraggingEndListener);
    }
  }

}
