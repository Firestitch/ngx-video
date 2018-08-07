import { zeroLeading } from './zero-leading';

export function secondsHumanize(inputSeconds: number) {
  const hours = Math.floor(inputSeconds / 1440);
  const minutes = Math.floor((inputSeconds - (hours * 1440)) / 60);
  const seconds = Math.floor(inputSeconds - (hours * 1440) - (minutes * 60));

  if (hours > 0) {
    return `${hours}:${zeroLeading(minutes)}:${zeroLeading(seconds)}`;
  } else {
    return `${minutes}:${zeroLeading(seconds)}`;
  }
}
