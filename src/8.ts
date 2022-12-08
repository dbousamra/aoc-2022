import { assert } from 'console';
import _ from 'lodash';
import { Base } from './base';

type Position = { x: number; y: number };

export class Problem8 extends Base {
  static makeAssertions(
    map: number[][],
    position: Position,
    expected: boolean,
    positions: { first: Position[]; second: Position[] },
  ) {
    const verticalPositions = Problem8.getVerticalPositions(map.length, position);
    assert(Problem8.isVisible(position, map) === expected, '1,1');
    assert(_.isEqual(verticalPositions, positions), 'Vertical positions 1,1');
  }

  static getVerticalPositions = (
    height: number,
    position: Position,
  ): {
    up: Position[];
    down: Position[];
  } => {
    const firstYs = _.range(0, position.y);
    const secondYs = _.range(position.y + 1, height);

    const firstXs = _.times(position.y).map(_.constant(position.x));
    const secondXs = _.times(height - 1 - position.y).map(_.constant(position.x));

    const up = _.map(_.zip(firstYs, firstXs) as unknown as number[][], ([y, x]) => ({
      x,
      y,
    })).reverse();
    const down = _.map(_.zip(secondYs, secondXs) as unknown as number[][], ([y, x]) => ({
      x,
      y,
    }));

    return { up, down };
  };

  static getHorizontalPositions = (
    width: number,
    position: Position,
  ): {
    left: Position[];
    right: Position[];
  } => {
    const firstXs = _.range(0, position.x);
    const secondXs = _.range(position.x + 1, width);

    const firstYs = _.times(position.x).map(_.constant(position.y));
    const secondYs = _.times(width - 1 - position.x).map(_.constant(position.y));

    const left = _.map(_.zip(firstYs, firstXs) as unknown as number[][], ([y, x]) => ({
      x,
      y,
    })).reverse();
    const right = _.map(_.zip(secondYs, secondXs) as unknown as number[][], ([y, x]) => ({
      x,
      y,
    }));

    return { left, right };
  };

  static isVisible(position: Position, map: number[][]): boolean {
    const heightAtPosition = _.get(map, [position.y, position.x]);

    const verticalPositions = Problem8.getVerticalPositions(map.length, position);
    const horizontalPositions = Problem8.getHorizontalPositions(map.length, position);

    const isVisibleVertically = _.some(verticalPositions, (positions) => {
      return _.every(positions, (pos) => {
        return heightAtPosition > _.get(map, [pos.y, pos.x]);
      });
    });

    const isVisibleHorizontally = _.some(horizontalPositions, (positions) => {
      return _.every(positions, (pos) => {
        return heightAtPosition > _.get(map, [pos.y, pos.x]);
      });
    });

    return isVisibleVertically || isVisibleHorizontally;
  }

  static getDistance(map: number[][], position: Position, positionsToCheck: Position[]): number {
    let distance = 0;

    for (const pos of positionsToCheck) {
      const heightAtPosition = _.get(map, [pos.y, pos.x]);
      const heightAtLookingPosition = _.get(map, [position.y, position.x]);

      if (heightAtPosition >= heightAtLookingPosition) {
        distance += 1;
        break;
      }

      distance += 1;
    }

    return distance;
  }

  static getViewingDistance(map: number[][], position: Position): number {
    const { up, down } = Problem8.getVerticalPositions(map.length, position);
    const { left, right } = Problem8.getHorizontalPositions(map.length, position);

    const upDistance = Problem8.getDistance(map, position, up);
    const downDistance = Problem8.getDistance(map, position, down);
    const leftDistance = Problem8.getDistance(map, position, left);
    const rightDistance = Problem8.getDistance(map, position, right);

    return upDistance * downDistance * leftDistance * rightDistance;
  }

  static parseMap(input: string): number[][] {
    return _.chain(input)
      .split('\n')
      .map((line) => _.split(line, '').map(_.parseInt))
      .value();
  }

  async part1(): Promise<void> {
    const map = Problem8.parseMap(this.in);
    const results = _.map(map, (row, y) =>
      _.map(row, (col, x) => {
        return Problem8.isVisible({ x, y }, map);
      }),
    );
    console.log(_.filter(_.flatten(results), _.identity).length);
  }

  async part2(): Promise<void> {
    const map = Problem8.parseMap(this.in);
    const results = _.map(map, (row, y) =>
      _.map(row, (col, x) => {
        return Problem8.getViewingDistance(map, { x, y });
      }),
    );

    const hightestDistance = _.max(_.flatten(results));
    console.log(hightestDistance);
  }
}
