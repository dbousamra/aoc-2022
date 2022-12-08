import _ from 'lodash';
import { Base } from './base';

const window = <A>(array: A[], size: number): A[][] => {
  return array.map((_, i, ary) => ary.slice(i, i + size)).slice(0, -size + 1);
};

export class Problem6 extends Base {
  getWindowPosition(size: number) {
    const chars = this.in.split('');
    const windows = window(chars, size);
    return _.findIndex(windows, (window) => _.uniq(window).length === size) + size;
  }

  async part1(): Promise<void> {
    console.log(this.getWindowPosition(4));
  }

  async part2(): Promise<void> {
    console.log(this.getWindowPosition(14));
  }
}
