<script lang="ts">
  import logo from '/icons/128.png';
</script>

<div class="tab-panel" id="help" role="tabpanel" aria-labelledby="evaluation-tab">
  <img src={logo} width="128" alt="Logo green tracker" />
  <h3 class="version-title">V{chrome.runtime.getManifest().version}</h3>

  <h2 c>
    {chrome.i18n.getMessage('help_test_extension')}
  </h2>

  <ul>
    <li>{chrome.i18n.getMessage('help_prerequisite_field')}</li>
  </ul>
  <h2>
    {chrome.i18n.getMessage('help_use_extension')}
  </h2>
  <ul>
    <li>
      {chrome.i18n.getMessage('help_use_extension_nav_tools')}
    </li>
    <li>{chrome.i18n.getMessage('help_use_extension_eval_page')}</li>
    <li>{chrome.i18n.getMessage('help_use_extension_analyze')}</li>
    <li>{chrome.i18n.getMessage('help_use_extension_start_analysis')}</li>
    <li>{chrome.i18n.getMessage('help_use_extension_results')}</li>
    <li>{chrome.i18n.getMessage('help_use_extension_save')}</li>
    <li>{chrome.i18n.getMessage('help_use_extension_saved_results')}</li>
  </ul>
  <h2>
    {chrome.i18n.getMessage('help_warnings')}
  </h2>
  <ul>
    <li>{chrome.i18n.getMessage('help_warnings_no_requests')}</li>
    <li>{chrome.i18n.getMessage('help_warnings_correct_eval')}</li>
    <li>{chrome.i18n.getMessage('help_warnings_ad_block')}</li>
    <li>{chrome.i18n.getMessage('help_warnings_diff_results')}</li>
    <ul>
      <li>{chrome.i18n.getMessage('help_warnings_continuous_update')}</li>
      <li>{chrome.i18n.getMessage('help_warnings_ads')}</li>
      <li>{chrome.i18n.getMessage('help_warnings_scrolling')}</li>
      <li>{chrome.i18n.getMessage('help_warnings_privacy')}</li>
      <li>{chrome.i18n.getMessage('help_warnings_cache')}</li>
    </ul>

    <li>{chrome.i18n.getMessage('help_warnings_user_path')}</li>
    <ul>
      <li>{chrome.i18n.getMessage('help_warnings_env_impacts')}</li>
    </ul>

    <li>{chrome.i18n.getMessage('help_warnings_permissions')}</li>
    <ul>
      <li>{chrome.i18n.getMessage('help_warnings_permissions_use')}</li>
      <ul>
        <li>{chrome.i18n.getMessage('help_warnings_activeTab')}</li>
        <li>{chrome.i18n.getMessage('help_warnings_all_urls')}</li>
        <li>{chrome.i18n.getMessage('help_warnings_browsing_data')}</li>
        <li>{chrome.i18n.getMessage('help_warnings_storage')}</li>
        <li>{chrome.i18n.getMessage('help_warnings_web_nav')}</li>
      </ul>
    </ul>
  </ul>
</div>

<style lang="scss">
  $title-color: rgb(96, 128, 108);
  .tab-panel {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 0 20px 0 20px;

    .version-title {
      color: $title-color;
      margin-top: -20px;
    }

    h2 {
      color: $title-color;
      margin-bottom: -10px;
      margin-top: 5px;
      align-self: flex-start;
    }
  }
</style>
