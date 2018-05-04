import { fractionOfNumber } from '../../helpers';

export class BufferInterval {
  public start = 0;
  public end = 0;

  public startPosition: number;
  public endPosition: number;

  public left: string;
  public width: string;
  public element = document.createElement('div');

  constructor() {
    this.element.classList.add('buffered-part');
  }

  public updateDimensions(start: number, end: number, duration: number) {
    this.start = start;
    this.end = end;

    this.startPosition = fractionOfNumber(this.start, duration) * 100;
    this.endPosition = fractionOfNumber(this.end, duration) * 100;

    this.left = `${this.startPosition || 0}%`;
    this.width = `${ (this.endPosition - this.startPosition) || 0}%`;

    this.applyDimensions();
  }

  public applyDimensions() {
    this.element.style.left = this.left;
    this.element.style.width = this.width;
  }

  public destroy() {
    this.element.remove();
  }
}
