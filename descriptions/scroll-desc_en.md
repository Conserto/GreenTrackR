# **Auto scroll/Page Tab** 

**Auto scroll/Page** lets you assess a specific section and/or an whole active web page of your browser's tab in auto-scroll mode. To define the section of the web page to be analysed in auto-scroll mode, you need to input a percentage or a number of pixels. The analysis is run by using the **Auto Scrolling** button. The analysis is based on the location of the country hosting the website and the country in which the user is located. The default value is automatic, but you can set this value by using the select boxes. Two types of assessment are possible: 

- **Assessment without cache**: clear the cache by using the **Clear cache** button, then run analysis by using the **Analysis** button, and the results are displayed.

- **Assessment with cache** : click on the **Reload page** button, then on the **Analysis** button, and the results are displayed.

## How to read the results?

GreenTrackr assesses different footprints:

- **Greenhouse gas (GHG)**: CO2 equivalent unit "eq. CO2" is the key indicator of global warming. 

- **Electricity consumption (ELEC)**: Kilowatt-hour "kWh" unit.

- **Water consumption (WATER)**: liters (l or m3) unit . 

- **Abiotic resources (ADP)**: kg antimony equivalent "kg eq. SB" unit, these are non-renewable natural resources ( minerals).  

Footprints are computed separately for terminals (modeled by the weight of the uncompressed page in kB), the network (modeled by the weight of the compressed page in kB) and servers (modeled by the number of non-extension requests). These footprints are then aggregated, taking into account the energy mix (carbon intensity factor in gCO2eq/kWh of electricity consumed) of the server (location of server IP address) and client (location of user IP address).

A grade from A to F (on a linear gauge) and a score (the higher the score, closer to 100, the better the web page!) are then computed to represent the environmental footprint.

### Resources analysis 

The table summarizing the resources used on the page analyzed details the number of css files, js files, $\dots$ images, etc., the percentage of each resource, as well as their compressed and decompressed weight (cached or not). The results of the table enable you to analyze the best eco-design practices and, where appropriate, the recommendations to be implemented to reduce the environmental footprint of your website. 