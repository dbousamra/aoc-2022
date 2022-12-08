import _, { isNumber } from 'lodash';
import { Base } from './base';

type FileResult = { type: 'file'; name: string; size: number };
type DirResult = { type: 'dir'; name: string };
type LsResult = FileResult | DirResult;

type Ls = { type: 'ls'; results: LsResult[] };
type Cd = { type: 'cd'; path: string };
type Command = Cd | Ls;

interface FileTree {
  [key: string]: FileTree | number;
}

export class Problem7 extends Base {
  static parseCommands(input: string): Command[] {
    const commands = _.chain(input)
      .split('$ ')
      .map((line) => _.compact(line.split('\n')))
      .reject(_.isEmpty)
      .map((commandArr) => {
        const [command, ...args] = commandArr;

        if (_.startsWith(command, 'cd ')) {
          const path = _.last(command.split(' '));
          return { type: 'cd', path } as Cd;
        }

        if (_.startsWith(command, 'ls')) {
          const results = _.map(args, (arg) => {
            if (_.startsWith(arg, 'dir')) {
              return { type: 'dir', name: _.last(arg.split(' ')) } as DirResult;
            } else {
              const [size, name] = arg.split(' ');
              return { type: 'file', name, size: _.parseInt(size) } as FileResult;
            }
          });

          return { type: 'ls', results } as Ls;
        }
      })
      .compact()
      .value();

    return commands;
  }

  static executeCommands(commands: Command[]) {
    let currentDir: string[] = [];
    let fileTree: FileTree = {};

    _.each(commands, (command) => {
      if (command.type === 'cd') {
        if (command.path === '..') {
          currentDir.pop();
        } else {
          currentDir.push(command.path);
        }
      } else {
        _.each(command.results, (result) => {
          switch (result.type) {
            case 'file':
              _.set(fileTree, [...currentDir, result.name], result.size);
              break;
            case 'dir':
              _.set(fileTree, [...currentDir, result.name], {});
              break;
          }
        });
      }
    });

    return fileTree;
  }

  static getFileTreeSize(fileTree: FileTree): number {
    return _.sumBy(_.values(fileTree), (value) => {
      if (isNumber(value)) {
        return value;
      } else {
        return Problem7.getFileTreeSize(value);
      }
    });
  }

  static getDirectorySizes(fileTree: FileTree, sizes: Record<string, number> = {}) {
    return _.reduce(
      fileTree,
      (acc, value, key) => {
        if (_.isObject(value)) {
          return Problem7.getDirectorySizes(value, {
            ...acc,
            [key]: Problem7.getFileTreeSize(value),
          });
        }

        return acc;
      },
      sizes,
    );
  }

  static getDirectorySizeSumOverN(fileTree: FileTree, n: number): number {
    return _.reduce(
      fileTree,
      (acc, value, key) => {
        if (_.isObject(value)) {
          const size = Problem7.getFileTreeSize(value);

          if (size <= n) {
            return acc + size + Problem7.getDirectorySizeSumOverN(value, n);
          } else {
            return acc + Problem7.getDirectorySizeSumOverN(value, n);
          }
        }

        return acc;
      },
      0,
    );
  }

  static getDirectoryTodelete(
    fileTree: FileTree,
    spaceToDelete: number,
    blah: { path: string; size: number }[] = [],
  ): { path: string; size: number }[] {
    _.each(fileTree, (value, key) => {
      if (_.isObject(value)) {
        const size = Problem7.getFileTreeSize(value);
        if (size >= spaceToDelete) {
          blah.push({ path: key, size });
          Problem7.getDirectoryTodelete(value, spaceToDelete, blah);
        }
      }
    });

    return blah;
  }

  async part1(): Promise<void> {
    const commands = Problem7.parseCommands(this.in);
    const fileTree = Problem7.executeCommands(commands);
    const directorySizesOverN = Problem7.getDirectorySizeSumOverN(fileTree, 100000);
    console.log(directorySizesOverN);
  }

  async part2(): Promise<void> {
    const commands = Problem7.parseCommands(this.in);
    const fileTree = Problem7.executeCommands(commands);
    const totalFileTreeSize = Problem7.getFileTreeSize(fileTree);
    const totalSpace = 70000000;
    const requiredSpace = 30000000;
    const unusedSpace = totalSpace - totalFileTreeSize;
    const spaceToDelete = requiredSpace - unusedSpace;
    const directoryToDelete = Problem7.getDirectoryTodelete(fileTree, spaceToDelete);
    const smallestPath = _.chain(directoryToDelete).sortBy('size').head().value();

    console.log(smallestPath.size);
  }
}
