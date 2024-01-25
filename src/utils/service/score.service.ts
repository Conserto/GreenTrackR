import type { Score } from 'src/interface/score.interface';

export class ScoreService {
  constructor() {}

  getScore(gesValue: number): Score {
    const grade = this.getGradeLetter(gesValue);
    const value = this.getScoreValue(gesValue);
    const color = this.getScoreColor(grade);

    return { grade, value, color };
  }

  getGradeLetter(gesValue: number): string {
    if (gesValue < 0.25) return 'A+';
    if (gesValue > 4.5) return 'F';
    if (gesValue > 4.25) return 'E';
    if (gesValue > 3.75) return 'D';
    if (gesValue > 3.25) return 'D+';
    if (gesValue > 2.75) return 'C';
    if (gesValue > 2.0) return 'C+';
    if (gesValue > 1.25) return 'B';
    if (gesValue > 0.5) return 'B+';
    return 'A';
  }

  /**
   * Return the correct classes to add, to adapt the background color with the score
   * @param {String|Number} score - The current score with a string (e.g: "A") or a number from 0 to 100
   * @returns {Array}
   */

  //TODO: revoir score
  getScoreColor(score: string | number): string[] {
    const scoreMap = [
      { limit: 95, grade: 'A+', classes: ['gradeAPlus'] },
      { limit: 90, grade: 'A', classes: ['gradeA'] },
      { limit: 75, grade: 'B+', classes: ['gradeBPlus'] },
      { limit: 60, grade: 'B', classes: ['gradeB'] },
      { limit: 45, grade: 'C+', classes: ['gradeCPlus'] },
      { limit: 35, grade: 'C', classes: ['gradeC'] },
      { limit: 25, grade: 'D+', classes: ['gradeDPlus'] },
      { limit: 15, grade: 'D', classes: ['gradeD'] },
      { limit: 10, grade: 'E', classes: ['gradeE'] },
      { limit: -Infinity, grade: 'F', classes: ['gradeF'] },
    ];

    for (let element of scoreMap) {
      if (score === element.grade || score >= element.limit) {
        return element.classes;
      }
    }
    return [''];

    // Default case when score is less than 25 or "F"
    //return ['gradeF', 'text-white'];
  }

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
}
