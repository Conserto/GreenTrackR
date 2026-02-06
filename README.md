<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/images/logo.png">
    <img alt="GreenTrackr" src="./public/images/logo.png">
  </picture>
</p>

# GreenTrackr

GreenTrackr is an eco-designed browser extension that lets you assess your website's environmental footprint in plug and play. The assessment is based on the estimated energy consumption (Wh) of three parameters which represent each third of the architecture of a digital service : 

- The **user**: downloaded data (**uncompressed page size**) 
- The **network**: transferred data (**compressed page size**)
- The **server**: number of requests (**HTTP**)

GreenTrackr uses two external **APIs** (**Electricity Map's CO2signal** and **IP Geolocation**) to identify the energy mix of the country hosting the website and the country in which the user is located.

For more information on GreenTrackr calculations, please refer to https://conserto.pro/greentrackr/

## ⚙️ Install and setup

- Add **GreenTrackr** to:
  - **Chrome** (available on the Chrome Web Store)
  - **Chromium-based browsers** (e.g. Edge, Brave, Opera, Vivaldi)
  - **Firefox** (available on Firefox Add-ons)
- Open the browser dev tools (DevTools): ```Ctrl+Shift+I```
  - Check if GreenTrackr tab is added on the DevTools 
    - Four tabs are available : **Assessment/Page**, **Auto scroll/Page**, **User journey** and **Settings**
  - Two parameters are required to activate GreenTrackr in the **Settings** tab of the extension
    - ⚠️ A **token** to access the 'Electricity Maps' API: *Temporarily unavailable. We are currently working on restoring this service.*
    - Number of retries to analyze requests for the current page
- Click on the three vertical dots ($\vdots$) to customize and control DevTools
  - We recommend you undock it in a **separate window**
- Uncheck the **Disable cache** box, in the DevTools Network tab
- Type the **url** of the website to be analyzed on chrome search bar. 

### 📋 Note

- GreenTrackr is compatible with:
  - **Chromium / Chromium-based browsers** (Manifest V3)
  - **Firefox** (dedicated version)
- Remember to refresh the page
- The use of an ad blocker or other filter has an impact on the result

## ✒️ Tutorial

### Evaluation/Page

- Two ways to evaluate: **with cache** and **without cache**
  - **Evaluation with cache**: click on the "**Analyze**" button 
  - **Evaluation without cache**: click on the "**Remove cache**" button, then on the "**Analyze**" button 
- The results are displayed
- You can **save** this result in a history via the "**Save assessment**" button
- The saved results history is available via the "**View history**" button
- The "**Reset measurement**" button resets the measurement

### Auto scroll/Page

You can accurately analyze the web page by percentage (**%**) to Auto scroll. The results are obtained following the same process as the **Evaluation/Page** option.

### User journey

You can assess the environmental footprint of a user journey into the "**User journey**" tab. When you start the analysis, by clicking on the "**Start recording**" button, the extension will record your user journey. Once the journey has been completed, click on the "**Stop recording**" button to display the results table for each action performed: "**(scroll)**" and/or "**(click)**" $\dots$ on the visited pages. The "**Reset journey**" and "**Clear cache**" buttons allow you to empty the locally stored results, thus restarting a journey from scratch.

## ✔️ Extension permissions

To work properly, the extension requires the following permissions:

- **activeTab**, **tabs**: used to display the saved analysis page and to access the contents of the pages for analysis
- **<all_urls>**: used to access URLs for analysis
- **browsingData**: used to clear the browser cache
- **Storage**: used to store the different assessments
- **Web Navigation**: used to detect when the analyzed page has finished loading

## 📃 License
[GNU Affero General Public License v3.0](./LICENSE)
