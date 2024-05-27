# **User journey Tab** 

**User Journey** lets you assess a user journey based on a series of actions for a given use case. The analysis is run by using the **Start recorder** button, and the extension will record the journey performed. Once the journey has been completed, clicking the **Stop saving** button displays two tables of results (a summary table and a detailed table) for each action performed: "(scroll)" and/or "(click)" on the pages visited. The analysis is based on the location of the country hosting the website and the country in which the user is located. The default value is automatic, but you can set this value by using the select boxes. 

## How to read the results?

GreenTrackr assesses different footprints:

- **Greenhouse gas (GHG)**: CO2 equivalent unit "eq. CO2" is the key indicator of global warming. 

- **Electricity consumption (ELEC)**: Kilowatt-hour "kWh" unit.

- **Water consumption (WATER)**: liters (l or m3) unit . 

- **Abiotic resources (ADP)**: kg antimony equivalent "kg eq. SB" unit, these are non-renewable natural resources ( minerals).  

Footprints are computed separately for terminals (modeled by the weight of the uncompressed page in kB), the network (modeled by the weight of the compressed page in kB) and servers (modeled by the number of non-extension requests). These footprints are then aggregated, taking into account the energy mix (carbon intensity factor in gCO2eq/kWh of electricity consumed) of the server (location of server IP address) and client (location of user IP address).

A grade from A to F (on a linear gauge) and a score (the higher the score, closer to 100, the better the web page!) are then computed to represent the environmental footprint.