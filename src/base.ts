import fs from 'fs';
import path from 'path';

export abstract class Base {
  in: string;

  constructor(filename: string) {
    this.in = fs.readFileSync(path.join(__dirname, '../', 'data', filename)).toString();
  }

  abstract part1(): Promise<void>;

  abstract part2(): Promise<void>;

  static async run(this: { new (filename: string): Base }, filename: string): Promise<void> {
    const base = new this(filename);
    await base.part1();
    await base.part2();
  }
}
