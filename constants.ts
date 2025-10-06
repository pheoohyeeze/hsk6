import type { Exam } from './types';
import { H61001_DATA } from './data/hsk6/H61001';
import { H61330_DATA } from './data/hsk6/H61330';
import { H61328_DATA } from './data/hsk6/H61328';
import { H61332_DATA } from './data/hsk6/H61332';
import { H61002_DATA } from './data/hsk6/H61002';
import { H61003_DATA } from './data/hsk6/H61003';
import { H61004_DATA } from './data/hsk6/H61004';
import { H61005_DATA } from './data/hsk6/H61005';

const examsList: Exam[] = [
  H61001_DATA,
  H61002_DATA,
  H61003_DATA,
  H61004_DATA,
  H61005_DATA,
  H61330_DATA,
  H61328_DATA,
  H61332_DATA,
];

export default examsList;
