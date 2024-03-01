import { ScoreGradeEnum } from 'src/enum';
import type { Score } from 'src/interface';

export const A: Score = {
  gradeLetter: ScoreGradeEnum.A,
  color: '#026739',
  textColor: 'white',
  limit: 0.85,
};
export const B: Score = {
  gradeLetter: ScoreGradeEnum.B,
  color: '#8fc547',
  textColor: 'black',
  limit: 1.75,
};
export const C: Score = {
  gradeLetter: ScoreGradeEnum.C,
  color: '#f4e300',
  textColor: 'black',
  limit: 2.5,
};
export const D: Score = {
  gradeLetter: ScoreGradeEnum.D,
  color: '#f7951b',
  textColor: 'black',
  limit: 3.25,
};
export const E: Score = {
  gradeLetter: ScoreGradeEnum.E,
  color: '#ff1307',
  textColor: 'black',
  limit: 5,
};
export const F: Score = {
  gradeLetter: ScoreGradeEnum.F,
  color: '#c31d2a',
  textColor: 'white',
  limit: Infinity,
};

export const ALL_SCORES = [A, B, C, D, E, F];
