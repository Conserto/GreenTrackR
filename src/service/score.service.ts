import type { Score } from 'src/interface/score.interface';
import { ALL_SCORES } from 'src/const';
import { logErr } from '../utils/log';

export class ScoreService {
  constructor() {
  }

  getScore(gesValue: number | undefined): Score | undefined {
    if (gesValue && gesValue > 0) {
      let scoreValue = this.getScoreValue(gesValue);
      const score = ALL_SCORES.find((grade: Score) => gesValue <= grade.limit);
      if (score) {
        return { ...score, value: scoreValue };
      }
    }
    logErr('No Score found');
    return undefined;
  }

  getAllScoreGrade() {
    return ALL_SCORES;
  }

  getScoreValue(gesValue: number) {
    const calcGESScore = -20 * gesValue + 100;

    let otherScore = (gesValue * 4.5) / 1000000;
    let i = 1;
    while (otherScore < 10) {
      otherScore *= 10;
      i *= 10;
    }

    if (gesValue <= 4.5) {
      return calcGESScore;
    } else if (gesValue > 10) {
      return Math.log(10 - (gesValue * 4.5 * i) / 10000000 + 2);
    } else {
      return gesValue;
    }
  }

  static getScoreForGrade(score?: number) {
    return score ? `${Math.round(score)}/100` : '-';
  }
}
