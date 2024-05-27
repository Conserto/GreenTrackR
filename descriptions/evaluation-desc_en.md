# **Assessment/Page Tab** 

**Assessment/Page** lets you assess an active Web page in your browser's tab. The analysis is run by using the **Analysis** button. The analysis is based on the location of the country hosting the website and the country in which the user is located. The default value is automatic, but you can set this value by using the select boxes. Two types of assessment are possible: 

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