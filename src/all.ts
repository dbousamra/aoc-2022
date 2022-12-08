import { Problem1 } from './1';
import { Problem2 } from './2';
import { Problem3 } from './3';
import { Problem4 } from './4';
import { Problem5 } from './5';
import { Problem6 } from './6';
import { Problem7 } from './7';

console.time('All');

Promise.all([
  Problem1.run('1.txt'),
  Problem2.run('2.txt'),
  Problem3.run('3.txt'),
  Problem4.run('4.txt'),
  Problem5.run('5.txt'),
  Problem6.run('6.txt'),
  Problem7.run('7.txt'),
]).then(() => {
  console.timeEnd('All');
});
