import _ from 'lodash';
import { Base } from './base';

export class Problem1 extends Base {
  getElfInventories(): number[] {
    return _.chain(this.in)
      .split('\n\n')
      .map((i) => _.sum(i.split('\n').map((i) => _.toInteger(i))))
      .value();
  }

  async part1(): Promise<void> {
    const elfInventories = this.getElfInventories();
    console.log(_.max(elfInventories));
  }

  async part2(): Promise<void> {
    const elfInventories = this.getElfInventories();
    const top3 = _.chain(elfInventories)
      .sortBy((i) => -i)
      .take(3)
      .value();
    console.log(_.sum(top3));
  }
}
