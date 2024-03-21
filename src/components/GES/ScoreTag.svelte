<!-- Bloc contenant le score sous forme d'echelle imagée allant de A -> G-->
<script lang="ts">
  import { ALL_SCORES } from 'src/const';
  import type { Score } from 'src/interface';
  import { ScoreService } from 'src/service';
  import { translate } from 'src/utils/utils';

  export let score: Score | undefined;

  $: resScore = ScoreService.getScoreForGrade(score?.value);
</script>

<div class="scores-tag">
  <p class="score-label">{translate('gesScore')} :</p>
  {#each ALL_SCORES as scoreLevel}
    <div class="score" style:background-color={scoreLevel.color}>
      <span
        class:active={scoreLevel.gradeLetter === score?.gradeLetter}
        class="score-letter"
        style:color={scoreLevel.gradeLetter === score?.gradeLetter
          ? scoreLevel.textColor
          : 'transparent'}>{scoreLevel.gradeLetter}</span>
      {#if scoreLevel.gradeLetter === score?.gradeLetter}
        <p class="score-number">
          {resScore}
        </p>{/if}
    </div>
  {/each}
</div>

<style lang="scss">
  .scores-tag {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 280px;
  }

  .score-label {
    margin-right: var(--spacing--xxl);
    font-weight: var(--font-weight--bold);
  }

  .score {
    width: 10%;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color--white);
  }

  .score-letter {
    color: transparent;

    &.active {
      background-color: inherit;
      height: 4rem;
      width: 4rem;
      border-radius: 100%;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      border: var(--border-width--thick) solid var(--color--white);
      color: var(--color--white);
      font-size: var(--font-size--xxl);
      font-weight: var(--font-weight--bold);
      line-height: 2;
    }
  }

  .score-number {
    display: flex;
    color: var(--color--dark);
    position: relative;
    top: 3rem;
    font-weight: var(--font-weight--bold);
    font-size: var(--font-size--sm);
  }
</style>
