import _ from 'lodash';
import { Base } from './base';

interface SectionAssignment {
  start: number;
  end: number;
}

export class Problem4 extends Base {
  static doesOverlapFully(section1: SectionAssignment, section2: SectionAssignment): boolean {
    return section1.start <= section2.start && section1.end >= section2.end;
  }

  static doesOverlapPartially(section1: SectionAssignment, section2: SectionAssignment): boolean {
    // does section 1 overlap partially with section2
    const overlap1 =
      (section1.start <= section2.start && section1.end >= section2.start) ||
      (section1.start <= section2.end && section1.end >= section2.end);

    const overlap2 =
      (section2.start <= section1.start && section2.end >= section1.start) ||
      (section2.start <= section1.end && section2.end >= section1.end);

    return overlap1 || overlap2;
  }

  getSectionAssignments(): SectionAssignment[][] {
    return _.chain(this.in)
      .split('\n')
      .map((i) =>
        i
          .split(',')
          .map((i) => i.split('-'))
          .map(([start, end]) => ({ start: _.parseInt(start), end: _.parseInt(end) })),
      )
      .value();
  }

  async part1(): Promise<void> {
    const sectionAssignments: SectionAssignment[][] = this.getSectionAssignments();

    const overlaps = _.filter(
      sectionAssignments,
      ([section1, section2]) =>
        Problem4.doesOverlapFully(section1, section2) ||
        Problem4.doesOverlapFully(section2, section1),
    );

    console.log(overlaps.length);
  }

  async part2(): Promise<void> {
    const sectionAssignments: SectionAssignment[][] = this.getSectionAssignments();

    const overlaps = _.filter(sectionAssignments, ([section1, section2]) => {
      const doesOverlap = Problem4.doesOverlapPartially(section1, section2);
      return doesOverlap;
    });

    console.log(overlaps.length);
  }
}
