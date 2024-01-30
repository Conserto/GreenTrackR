import { ScoreGradeEnum } from 'src/enum';
import type { Score } from 'src/interface';

export const A_PLUS: Score = {
  gradeLetter: ScoreGradeEnum.A_PLUS,
  color: 'rgba(3, 126, 34, 1)',
  textColor: 'white',
  limit: 0.24,
};
export const A: Score = {
  gradeLetter: ScoreGradeEnum.A,
  color: 'rgba(24, 164, 64, 1)',
  textColor: 'white',
  limit: 0.5,
};
export const B_PLUS: Score = {
  gradeLetter: ScoreGradeEnum.B_PLUS,
  color: 'rgba(52, 188, 110, 1)',
  textColor: 'white',
  limit: 1.25,
};
export const B: Score = {
  gradeLetter: ScoreGradeEnum.B,
  color: 'rgb(191, 222, 57)',
  textColor: 'black',
  limit: 2,
};
export const C_PLUS: Score = {
  gradeLetter: ScoreGradeEnum.C_PLUS,
  color: 'rgb(254, 244, 46)',
  textColor: 'black',
  limit: 2.75,
};
export const C: Score = {
  gradeLetter: ScoreGradeEnum.C,
  color: 'rgb(255, 212, 58)',
  textColor: 'white',
  limit: 3.25,
};
export const D_PLUS: Score = {
  gradeLetter: ScoreGradeEnum.D_PLUS,
  color: 'rgb(255, 183, 0)',
  textColor: 'white',
  limit: 3.75,
};
export const D: Score = {
  gradeLetter: ScoreGradeEnum.D,
  color: 'rgb(255, 139, 14)',
  textColor: 'white',
  limit: 4.25,
};
export const E: Score = {
  gradeLetter: ScoreGradeEnum.E,
  color: 'rgb(255, 102, 13)',
  textColor: 'white',
  limit: 5,
};

export const F: Score = {
  gradeLetter: ScoreGradeEnum.F,
  color: 'rgb(255, 19, 7)',
  textColor: 'white',
  limit: Infinity,
};

export const ALL_SCORES = [A_PLUS, A, B_PLUS, B, C_PLUS, C, D_PLUS, D, E, F];
