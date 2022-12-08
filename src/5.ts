import _ from 'lodash';
import { Base } from './base';

interface Move {
  from: number;
  to: number;
  amount: number;
}

type Crate = string;
type CrateStack = Crate[];

export class Problem5 extends Base {
  static parseMove(move: string): Move {
    const [amount, from, to] = move
      .replace('move ', '')
      .replace('from ', '')
      .replace('to ', '')
      .split(' ');

    return {
      amount: parseInt(amount),
      from: parseInt(from),
      to: parseInt(to),
    };
  }

  static parseInput(value: string): {
    crates: CrateStack[];
    moves: Move[];
  } {
    const [crates, moves] = _.chain(value)
      .split('\n\n')
      .map((i) => i.split('\n'))
      .value();

    const split = _.chain(crates)
      .initial()
      .map((crate) => crate.replace(/ {4}/g, ' '))
      .map((crate) =>
        crate
          .split(' ')
          .map((c) => (c === '' ? undefined : c.replace(/\[/g, '').replace(/]/g, ''))),
      )
      .value();

    const parsedCrates: CrateStack[] = _.chain(split)
      .unzip()
      .map(_.compact)
      .map((stack) => stack.reverse())
      .value();

    const parsedMoves: Move[] = _.map(moves, Problem5.parseMove);

    return {
      crates: parsedCrates,
      moves: parsedMoves,
    };
  }

  static runMove(move: Move, crates: CrateStack[]): CrateStack[] {
    _.times(move.amount, () => {
      const from = crates[move.from - 1].pop();
      crates[move.to - 1].push(from as Crate);
    });

    return crates;
  }

  static runMovePart2(move: Move, crates: CrateStack[]): CrateStack[] {
    const from = _.takeRight(crates[move.from - 1], move.amount);

    _.times(move.amount, () => {
      crates[move.from - 1].pop();
    });

    crates[move.to - 1].push(...from);

    return crates;
  }

  async part1(): Promise<void> {
    const parsed = Problem5.parseInput(this.in);
    let crates = [...parsed.crates];

    _.each(parsed.moves, (move) => {
      crates = Problem5.runMove(move, crates);
    });

    const result = _.map(crates, (stack) => _.last(stack)).join('');
    // console.log(result);
  }

  async part2(): Promise<void> {
    const parsed = Problem5.parseInput(this.in);
    let crates = [...parsed.crates];

    _.each(parsed.moves, (move) => {
      crates = Problem5.runMovePart2(move, crates);
    });

    const result = _.map(crates, (stack) => _.last(stack)).join('');
    console.log(result);
  }
}
