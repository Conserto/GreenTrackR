<script lang="ts">
  import { translate } from 'src/utils/utils';
  import { Footer } from 'src/components';
  import logo from '/icons/128.png';

  const { version } = chrome.runtime.getManifest();
</script>

<h3 class="version-title">V{version}</h3>

<h2 c>
  {translate('help_test_extension')}
</h2>

<ul>
  <li>{translate('help_prerequisite_field')}</li>
</ul>
<h2>
  {translate('help_use_extension')}
</h2>
<ul>
  <li>
    {translate('help_use_extension_nav_tools')}
  </li>
  <li>{translate('help_use_extension_eval_page')}</li>
  <li>{translate('help_use_extension_analyze')}</li>
  <li>{translate('help_use_extension_start_analysis')}</li>
  <li>{translate('help_use_extension_results')}</li>
  <li>{translate('help_use_extension_save')}</li>
  <li>{translate('help_use_extension_saved_results')}</li>
</ul>
<h2>
  {translate('help_warnings')}
</h2>
<ul>
  <li>{translate('help_warnings_no_requests')}</li>
  <li>{translate('help_warnings_correct_eval')}</li>
  <li>{translate('help_warnings_ad_block')}</li>
  <li>{translate('help_warnings_diff_results')}</li>
  <ul>
    <li>{translate('help_warnings_continuous_update')}</li>
    <li>{translate('help_warnings_ads')}</li>
    <li>{translate('help_warnings_scrolling')}</li>
    <li>{translate('help_warnings_privacy')}</li>
    <li>{translate('help_warnings_cache')}</li>
  </ul>

  <li>{translate('help_warnings_user_path')}</li>
  <ul>
    <li>{translate('help_warnings_env_impacts')}</li>
  </ul>

  <li>{translate('help_warnings_permissions')}</li>
  <ul>
    <li>{translate('help_warnings_permissions_use')}</li>
    <ul>
      <li>{translate('help_warnings_activeTab')}</li>
      <li>{translate('help_warnings_all_urls')}</li>
      <li>{translate('help_warnings_browsing_data')}</li>
      <li>{translate('help_warnings_storage')}</li>
      <li>{translate('help_warnings_web_nav')}</li>
    </ul>
  </ul>
</ul>

<style lang="scss">
  .version-title {
    color: var(--color--primary);
    margin-top: var(--spacing--xl);
  }

  h2 {
    align-self: flex-start;
    color: var(--color--primary);
    margin-bottom: calc(-1 * var(--spacing--md));
    margin-top: var(--spacing--xs);
  }
</style>
