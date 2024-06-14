import { ALL_SCORES } from 'src/const';
import { ScoreService } from 'src/service';
import { assert, expect, test } from 'vitest';
import { formatScoreForGrade, getGesScoreValue } from '../../utils';

const scoreService = new ScoreService();

const scoreGESObj = {
  gesValue: 1.84,
  score: {
    gradeLetter: 'C',
    color: '#f4e300',
    textColor: 'black',
    limit: 2.5,
    value: 63.199999999999996
  }
};

test('GetScore function', async () => {
  assert.deepEqual(scoreService.getScore(scoreGESObj.gesValue), scoreGESObj.score);
});

test('GetAllScoreGrade function', async () => {
  assert.equal(scoreService.getAllScoreGrade(), ALL_SCORES);
});

test('GetScoreValue function', async () => {
  expect(getGesScoreValue(scoreGESObj.gesValue)).toBe(scoreGESObj.score.value);
});

test('formatScoreForGrade function', async () => {
  expect(formatScoreForGrade(scoreGESObj.score.value)).toBe('63/100');
});
