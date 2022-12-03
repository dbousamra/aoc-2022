import _ from 'lodash';
import { Base } from './base';

// A X = Rock
// B Y= Paper
// C Z = Scissors

// X = Lose
// Y = Draw
// Z = Win

// A B C
// X Y Z

const shapeScore = {
  X: 1,
  Y: 2,
  Z: 3,
};

const outcomeTablePart1 = {
  X: {
    A: 3,
    B: 0,
    C: 6,
  },

  Y: {
    A: 6,
    B: 3,
    C: 0,
  },

  Z: {
    A: 0,
    B: 6,
    C: 3,
  },
};

const outcomeTablePart2 = {
  A: {
    X: 'Z',
    Y: 'X',
    Z: 'Y',
  },
  B: {
    X: 'X',
    Y: 'Y',
    Z: 'Z',
  },
  C: {
    X: 'Y',
    Y: 'Z',
    Z: 'X',
  },
};

class Problem2 extends Base {
  getStrategyGuide() {
    return _.chain(this.in)
      .split('\n')
      .chunk(3)
      .map((round) => {
        const turns = _.map(round, (turn) => _.split(turn, ' '));
        return turns;
      })
      .value();
  }

  async part1(): Promise<void> {
    const guide = this.getStrategyGuide();
    const scores = _.map(guide, (round) => {
      return _.map(round, (turn) => {
        const [enemy, me] = turn;
        return outcomeTablePart1[me][enemy] + shapeScore[me];
      });
    });
    const totalScores = _.sum(_.flatten(scores));
    console.log(totalScores);
  }

  async part2(): Promise<void> {
    const guide = this.getStrategyGuide();

    const scores = _.map(guide, (round) => {
      return _.map(round, (turn) => {
        const [enemy, me] = turn;
        const roundEndPlay = outcomeTablePart2[enemy][me];
        return outcomeTablePart1[roundEndPlay][enemy] + shapeScore[roundEndPlay];
      });
    });
    const totalScores = _.sum(_.flatten(scores));
    console.log(totalScores);
  }
}

Problem2.run('2.txt');
