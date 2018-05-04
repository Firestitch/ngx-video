import * as Hls from 'hls.js';
import { fractionOfNumber, scaleX } from '../../helpers';

import { BufferInterval } from './buffer-interval';
import { VideoService } from '../../services';

export class Scales {

  public buffers: BufferInterval[] = [];

  private _progressContainerElem: HTMLElement;
  private _playCurrentTime: HTMLElement;
  private _playProgressElem: HTMLElement;
  private _buffersContainerElem: HTMLElement;
  private _totalDurationElem: HTMLElement;

  private _duration: number;
  private _time: number;
  private _bufferCheckInterval;
  private _onFragBufferedCallback;

  private changeCurrentTimeByClickListener;

  constructor(private _player: VideoService) {
    this._onFragBufferedCallback = this.onFragBuffered.bind(this);

    this._progressContainerElem = this._player.containerTag.querySelector('#progress');
    this._playCurrentTime = this._player.containerTag.querySelector('#play-current-time');
    this._playProgressElem = this._player.containerTag.querySelector('#play-progress');
    this._buffersContainerElem = this._player.containerTag.querySelector('#buffers');
    this._totalDurationElem = this._player.containerTag.querySelector('#total-duration');

    this.subscribe();
    this.events();
  }

  /**
   * Update current time after buffer update
   * @param {number} value
   */
  public setTime(value: number) {
    this._time = value;
    const scaleTo = fractionOfNumber(this._time, this._duration);
    const currentTimePos = fractionOfNumber(this._player.videoTag.currentTime, this._duration) * 100;

    this._playProgressElem.setAttribute('style', scaleX(scaleTo));
    this._playCurrentTime.style.left = `${currentTimePos || 0}%`;
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
    this.changeCurrentTimeByClickListener = this.changeCurrentTimeByClick.bind(this);
    this._progressContainerElem.addEventListener('click', this.changeCurrentTimeByClickListener);
  }

  /**
   * Changing current time by click event
   * @param event
   */
  private changeCurrentTimeByClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const sizes = this._totalDurationElem.getBoundingClientRect();

    const target = (event.clientX - sizes.left) / sizes.width * this._duration;
    this._player.videoTag.currentTime = target;
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

    if (this.changeCurrentTimeByClickListener) {
      this._progressContainerElem.removeEventListener('click', this.changeCurrentTimeByClickListener);
    }
  }

}
