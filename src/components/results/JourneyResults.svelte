<script lang="ts">
  import type { Measure } from 'src/interface';
  import type { TableData, TableHeader } from 'src/interface/table.interface';
  import { formatGesMeasuresForTable, translate } from 'src/utils';
  import { SynthesisTable, Table } from 'src/components/journey';
  import { gesTableHeaders } from 'src/const';
  import { ButtonTypeEnum } from '../../enum';
  import { Button } from '../html';

  // Props: array of measurement data from parent component
  export let measures: Measure[];

  /**
   * Deduplicate measures based on URL, action, and timestamp proximity
   * Removes duplicate measurements that occur within 1 second of each other
   */
  function deduplicateMeasures(measures: Measure[]): Measure[] {
    const seen = new Set<string>();
    const deduplicated: Measure[] = [];

    for (const measure of measures) {
      // Create a unique key based on URL, action, and rounded timestamp (1-second precision)
      const timestamp = Math.floor(measure.date.getTime() / 1000); // Round to seconds
      const key = `${measure.url}|${measure.action || 'page'}|${timestamp}`;

      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(measure);
      }
    }

    return deduplicated;
  }

  // Deduplicate measures before processing
  $: uniqueMeasures = deduplicateMeasures(measures);

  // Debug log
  $: {
    console.info('JourneyResults - measures:', measures.length);
    console.info('JourneyResults - uniqueMeasures:', uniqueMeasures.length);
    if (measures.length !== uniqueMeasures.length) {
      console.warn(`Removed ${measures.length - uniqueMeasures.length} duplicate(s)`);
    }
  }

  // Format the deduplicated measures into table-compatible data structure
  $: dataFormatted = formatGesMeasuresForTable(uniqueMeasures);

  $: console.info('details:', dataFormatted);

  // Toggle state for showing/hiding full URLs
  let shortUrl = true;

  /**
   * Toggles between showing full URLs and shortened URLs
   */
  const switchUrl = () => {
    shortUrl = !shortUrl;
  };
</script>

<!-- Synthesis table showing aggregated results per page -->
<!-- This component expects Measure[] -->
<SynthesisTable
  className="{shortUrl ? 'hide--url' : ''}"
  datas={uniqueMeasures}
  caption={translate('messageResults')}
  description={translate('descriptionResults')}
/>

<br />

<!-- Detailed results table with full breakdown of metrics -->
<!-- This component expects Map<string, TableData>[] and TableHeader[] -->
<Table
  className="{shortUrl ? 'hide--url' : ''}"
  caption={translate('messageResultsDetail')}
  description={translate('descriptionResultsDetail')}
  columnHeaders={gesTableHeaders}
  datas={dataFormatted}
/>

<!-- Button to toggle URL display mode -->
<p>
  <Button
    on:buttonClick={switchUrl}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey={'switchUrlShow'}
  />
</p>