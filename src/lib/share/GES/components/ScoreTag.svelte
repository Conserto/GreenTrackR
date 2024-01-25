<!-- Bloc contenant le score sous forme d'echelle imagée allant de A -> G-->
<script lang="ts">
  const scores = [
    {
      grade: 'A+',
      class: 'gradeAPlus',
      color: 'rgba(3, 126, 34, 1)',
    },
    {
      grade: 'A',
      class: 'gradeA',
      color: 'rgba(24, 164, 64, 1)',
    },
    {
      grade: 'B+',
      class: 'gradeBPlus',
      color: 'rgba(52, 188, 110, 1)',
    },
    {
      grade: 'B',
      class: 'B',
      color: 'rgb(191, 222, 57)',
    },
    {
      grade: 'C+',
      class: 'gradeCPlus',
      color: 'rgb(254, 244, 46)',
    },
    {
      grade: 'C',
      class: 'gradeC',
      color: 'rgb(255, 212, 58)',
    },
    {
      grade: 'D+',
      class: 'gradeDPlus',
      color: 'rgb(255, 183, 0)',
    },
    {
      grade: 'D',
      class: 'gradeD',
      color: 'rgb(255, 139, 14)',
    },
    {
      grade: 'E',
      class: 'gradeE',
      color: 'rgb(255, 102, 13)',
    },
    {
      grade: 'F',
      class: 'gradeF',
      color: 'rgb(255, 19, 7)',
    },
  ];
</script>

<div class="scores-tag">
  {#each scores as score}
    <span class="score {score.class}" style:background-color={score.color}>
      <span class="score-letter">{score.grade}</span>
      <p class="score-number"></p>
    </span>
  {/each}
</div>

<style>
  .scores-tag {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    max-width: 280px;
  }

  .score {
    /*width: 2.5rem;*/
    width: 10%;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .score-letter {
    color: transparent;
  }

  .score-active {
    height: 4rem;
    width: 4rem;
    border-radius: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.3rem solid white;
    color: white;
    font-size: 1.8rem;
    font-weight: bold;
    line-height: 2;
  }

  .score-number {
    display: flex;
    color: black;
    position: relative;
    top: 3rem;
    font-weight: bold;
    /* display: none; */
  }
</style>
