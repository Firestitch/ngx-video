import { VideoService } from '../services';
import FullscreenApi from '../helpers/fullscreen-events';


export class Controls {

  private _playButton: HTMLElement;
  private _pauseButton: HTMLElement;
  private _muteButton: HTMLElement;
  private _unmuteButton: HTMLElement;
  private _fullscreenOn: HTMLElement;
  private _fullscreenOff: HTMLElement;

  private _overlayPauseLayout: HTMLElement;
  private _overlayPauseButton: HTMLElement;

  // Handlers
  private _onPlayHandler: EventListener;
  private _onPauseHandler: EventListener;
  private _switchMuteHandler: EventListener;
  private _switchFullscreenHandler: EventListener;
  private _fullscreenChangeHandler: EventListener;


  constructor(private _player: VideoService) {

    this._playButton    = this._player.containerTag.querySelector('#play');
    this._pauseButton   = this._player.containerTag.querySelector('#pause');
    this._muteButton    = this._player.containerTag.querySelector('#mute');
    this._unmuteButton  = this._player.containerTag.querySelector('#unmute');
    this._fullscreenOn  = this._player.containerTag.querySelector('#full-screen-on');
    this._fullscreenOff = this._player.containerTag.querySelector('#full-screen-off');

    this._overlayPauseLayout = this._player.containerTag.querySelector('#overlay');
    this._overlayPauseButton = this._player.containerTag.querySelector('#overlay .pause');

    this.events();
  }

  /**
   * Subscribe to events
   */
  private events() {
    this._onPlayHandler = this.play.bind(this);
    this._onPauseHandler = this.pause.bind(this);
    this._switchMuteHandler = this.switchMute.bind(this);
    this._switchFullscreenHandler = this.switchFullscreen.bind(this);
    this._fullscreenChangeHandler = this.fullscreenChangeHandler.bind(this);

    // Other events
    this._playButton.addEventListener('click', this._onPlayHandler);
    this._pauseButton.addEventListener('click', this._onPauseHandler);
    this._muteButton.addEventListener('click', this._switchMuteHandler);
    this._unmuteButton.addEventListener('click', this._switchMuteHandler);
    this._fullscreenOn.addEventListener('click', this._switchFullscreenHandler);
    this._fullscreenOff.addEventListener('click', this._switchFullscreenHandler);
    this._overlayPauseButton.addEventListener('click', this._onPlayHandler);

    // Full screen
    this._player.containerTag.addEventListener(FullscreenApi.fullscreenchange, this._fullscreenChangeHandler);
  }

  /**
   * Start playing
   */
  public play() {
    this._playButton.classList.add('hidden');
    this._pauseButton.classList.remove('hidden');
    this._player.videoTag.play();
    this._player.playing = true;
    this.hideOverlayPauseLayout();
  }

  /**
   * Stop playing
   */
  public pause() {
    this._playButton.classList.remove('hidden');
    this._pauseButton.classList.add('hidden');
    this._player.videoTag.pause();
    this._player.playing = false;
    this.showOverlayPauseLayout();
  }

  /**
   * Mute (on/off)
   */
  public switchMute() {
    this._player.muted = !this._player.muted;

    if (this._player.muted) {
      this._unmuteButton.classList.remove('hidden');
      this._muteButton.classList.add('hidden');
    } else {
      this._muteButton.classList.remove('hidden');
      this._unmuteButton.classList.add('hidden');
    }

    this._player.videoTag.muted = this._player.muted;
  }

  /**
   * Fullscreen on/off
   */
  public switchFullscreen() {
    this.setFullscreenStatus(!this._player.isFullscreenMode);
  }

  /**
   * Change full screen status (on/off)
   * @param {boolean} status
   */
  public setFullscreenStatus(status: boolean) {
    if (this._player.isFullscreenMode) {
      document[FullscreenApi.exitFullscreen]();
    } else {
      this._player.containerTag[FullscreenApi.requestFullscreen]();
    }

    this._player.isFullscreenMode = status;
  }

  /**
   * Fullscreen change handler(on/off)
   */
  public fullscreenChangeHandler() {
    const targetElem = document[FullscreenApi.fullscreenElement];

    if (!targetElem && this._player.isFullscreenMode) {
      this.setFullscreenStatus(false);
    }

    if (!this._player.isFullscreenMode) {
      this._fullscreenOn.classList.remove('hidden');
      this._fullscreenOff.classList.add('hidden');
      this._player.containerTag.classList.remove('full-screen-mode');
    } else {
      this._fullscreenOn.classList.add('hidden');
      this._fullscreenOff.classList.remove('hidden');
      this._player.containerTag.classList.add('full-screen-mode');
    }
  }

  /**
   * Show overlay layout with pause icon
   */
  private showOverlayPauseLayout() {
    this._overlayPauseLayout.classList.remove('hidden');
  }

  /**
   * Hide overlay layout with pause icon
   */
  private hideOverlayPauseLayout() {
    this._overlayPauseLayout.classList.add('hidden');
  }

  /**
   * Destroy everything
   */
  public destroy() {
    this._playButton.removeEventListener('click', this._onPlayHandler);
    this._pauseButton.removeEventListener('click', this._onPauseHandler);
    this._muteButton.removeEventListener('click', this._switchMuteHandler);
    this._unmuteButton.removeEventListener('click', this._switchMuteHandler);
    this._fullscreenOn.removeEventListener('click', this._switchFullscreenHandler);
    this._fullscreenOff.removeEventListener('click', this._switchFullscreenHandler);
    this._overlayPauseButton.removeEventListener('click', this._onPlayHandler);

    this._player.containerTag.removeEventListener(FullscreenApi.fullscreenchange, this._fullscreenChangeHandler);
  }

}
