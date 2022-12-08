import _, { split } from 'lodash';
import { Base } from './base';

export class Problem3 extends Base {
  static getPriority(item: string): number {
    const basePriority = _.toLower(item).charCodeAt(0) - 96;

    if (_.toUpper(item) === item) {
      return basePriority + 26;
    } else {
      return basePriority;
    }
  }

  static findCommonItemInGroup(group: string[]) {
    const splitGroups = _.map(group, (rucksack) => rucksack.split(''));

    for (const item of splitGroups[0]) {
      if (_.includes(splitGroups[1], item) && _.includes(splitGroups[2], item)) {
        return item;
      }
    }
  }

  parseRuckSackPart1(input: string): number {
    const half = Math.ceil(input.length / 2);
    const compartmentOne = input.slice(0, half).split('');
    const compartmentTwo = input.slice(half).split('');
    const common = _.intersection(compartmentOne, compartmentTwo);
    const priorities = _.map(common, Problem3.getPriority);
    return _.sum(priorities);
  }

  async part1(): Promise<void> {
    const rucksacks = _.split(this.in, '\n');
    const priorities = _.map(rucksacks, this.parseRuckSackPart1);
    console.log(_.sum(priorities));
  }

  async part2(): Promise<void> {
    const rucksacks = _.split(this.in, '\n');
    const groups = _.chunk(rucksacks, 3);
    const common = _.map(groups, Problem3.findCommonItemInGroup);
    const priorities = _.map(common, Problem3.getPriority);
    console.log(_.sum(priorities));
  }
}
