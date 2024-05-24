# **Onglet Parcours Utilisateur** 

**Parcours Utilisateur** vous permet d'évaluer d'un parcours client correspondant à une suite d'actions résalisées pour un cas d'usage donné. Le lancement de l'analyse se fait via le bouton **Démarrer l'enegistement**, l'extension enregistrera le parcours effectué. Une fois le parcours terminé, l'appui sur le bouton **Stopper l'enregistrement** permet d'afficher deux tableaux des résultats (un tableau récapitulatif et détaillé) pour chaque action effectuée : "(scroll)" et/ou "(click)" sur les pages visitées. L'analyse se base sur la localisation du pays hébergeant le site web et du pays dans lequel se trouve l'utilisateur, par défaut la valeur est en automatique, vous pouvez modifier cette valeur via les selects box. 

## Comment interpréter les résultats ?

GreenTrackr évalue différents impacts :

- **Gaz à effet de serre (GES)** unité équivalent CO2 « eq. CO2 » c’est l’indicateur le plus d’impact dans le réchauffement climatique. 

- **Consommation d’électricité (ELEC)** unité Kilowattheure « kWh ». 

- **Consommation d’eau (EAU)** unité litres (l ou m3). 

- **Ressources abiotiques (ADP)** unité kg équivalent antimoine « kg eq. SB » ce sont les ressources naturelles non renouvelables (minerais). 

Les impacts sont calculés de manière distincte pour les terminaux (modéliser par le poids de la page non-compressé en kB), le réseau (modéliser par le poids de la page compressé kB) et les serveurs (modéliser par le nombre de requêtes hors extension). Par la suite, ces impacts sont agrégés en tenant compte de mix énergétique (facteur d'intensité carbone en gCO2eq/kWh de l'électricité consommé)  du serveur (localisation de l'adresse IP du serveur) et du client ( localisation de l'adresse IP de l'utilisateur).

Une note de A à F (sur une jauge linéaire) et un score (plus le score est élevé proche de 100, meilleure est la page Web !) sont alors calculés pour refléter l'impact environnemental.

