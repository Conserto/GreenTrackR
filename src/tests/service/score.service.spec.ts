import { ALL_SCORES } from 'src/const';
import { ScoreService } from 'src/utils/service';
import { assert, expect, test } from 'vitest';

const scoreService = new ScoreService();

const scoreGESObj = {
  gesValue: 1.84,
  score: {
    color: 'rgb(191, 222, 57)',
    gradeLetter: 'B',
    limit: 2,
    textColor: 'black',
    value: 63.199999999999996,
  },
};

test('GetScore function', async () => {
  assert.deepEqual(scoreService.getScore(scoreGESObj.gesValue), scoreGESObj.score);
});

test('GetAllScoreGrade function', async () => {
  assert.equal(scoreService.getAllScoreGrade(), ALL_SCORES);
});

test('GetScoreValue function', async () => {
  expect(scoreService.getScoreValue(scoreGESObj.gesValue)).toBe(scoreGESObj.score.value);
});

test('GetScoreForGrade function', async () => {
  expect(ScoreService.getScoreForGrade(scoreGESObj.score.value)).toBe('63/100');
});
