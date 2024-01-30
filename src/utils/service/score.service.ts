import type { Score } from 'src/interface/score.interface';
import { ALL_SCORES } from 'src/const';
export class ScoreService {
  constructor() {}

  getScore(gesValue: number): Score {
    const score = this.getScoreInfosFromGesValue(gesValue);
    return score;
  }

  getAllScoreGrade() {
    return ALL_SCORES;
  }

  getScoreInfosFromGesValue(gesValue: number): Score {
    const scoreValue = this.getScoreValue(gesValue);
    const { gradeLetter, limit, color, textColor } = ALL_SCORES.find(
      (grade: Score) => gesValue <= grade.limit,
    ) as Score;
    return { value: scoreValue, gradeLetter, limit, color, textColor };
  }

  /**
   * Return the correct classes to add, to adapt the background color with the score
   * @param {String|Number} score - The current score with a string (e.g: "A") or a number from 0 to 100
   * @returns {Array}
   */

  /**
   * Return the score of the measure in a range of 0 to 100
   * @param {Number} gesMeasure
   * @returns {Number}
   */
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

  static getScoreForGrade(score: number) {
    let resultat = '';
    resultat += Math.round(score) + '/100';
    return resultat;
  }
}
