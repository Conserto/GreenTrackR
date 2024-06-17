import type { Score } from 'src/interface/score.interface';
import { ALL_SCORES } from 'src/const';
import { getGesScoreValue, logErr } from 'src/utils';

export class ScoreService {
  constructor() {
  }

  getScore(gesValue: number | undefined): Score | undefined {
    if (gesValue && gesValue > 0) {
      let scoreValue = getGesScoreValue(gesValue);
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

}
