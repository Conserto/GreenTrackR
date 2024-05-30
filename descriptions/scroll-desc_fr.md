# **Onglet Auto scroll/Page** 

L'**Auto scroll/Page** vous permet d'évaluer une partie et/ou une page Web entière active de l'onglet de votre navigateur en auto-scroll. Pour définir la section de la page Web à analyser en mode auto-scroll, il est nécessaire de saisir un pourcentage ou un nombre de pixels. L'analyse est lancée via le bouton **Auto Scroller**. L'analyse se base sur la localisation du pays hébergeant le site web et du pays dans lequel se trouve l'utilisateur. Par défaut la valeur est en automatique, vous pouvez modifier cette valeur via les select box. Deux types d'évaluation sont possibles : 

- **Evaluation sans cache** : cliquer sur le bouton **Vider le cache**, puis sur le bouton **Analyser**, les résultats s’affichent.
- **Evaluation avec cache** : cliquer sur le bouton **Recharger la page**, puis sur le bouton **Analyser**, les résultats s’affichent.

## Comment interpréter les résultats ?

GreenTrackr évalue différents impacts :

- **Gaz à effet de serre (GES)** : unité équivalent CO2 « eq. CO2 » : c’est l’indicateur clé du réchauffement climatique. 

- **Consommation d’électricité (ELEC)** : unité Kilowattheure « kWh ». 

- **Consommation d’eau (EAU)** : unité litres (l ou m3). 

- **Ressources abiotiques (ADP)** : unité kg équivalent antimoine « kg eq. SB » : ce sont les ressources naturelles non renouvelables (minerais). 

Les impacts sont calculés de manière distincte pour les terminaux (modéliser par le poids de la page non-compressé en kB), le réseau (modéliser par le poids de la page compressé kB) et les serveurs (modéliser par le nombre de requêtes hors extension). Par la suite, ces impacts sont agrégés en tenant compte de mix énergétique (facteur d'intensité carbone en gCO2eq/kWh de l'électricité consommé)  du serveur (localisation de l'adresse IP du serveur) et du client ( localisation de l'adresse IP de l'utilisateur).

Une note de A à F (sur une jauge linéaire) et un score (plus le score est élevé proche de 100, meilleure est la page Web !) sont alors calculés pour refléter l'impact environnemental.

### Analyse des ressources

Le tableau récapulatif des ressources utilisées de la page analysée illustre le nombre de fichier css, js, images $\dots$ etc, le pourcentage de chaque ressource, ainsi que leurs poids compréssé et décompréssé (en cache ou non). Les résultats du tableau vous permet d'analyser les bonnes pratiques d'éco-conception et, le cas échéant, les recommandations à mettre en œuvre pour réduire l'impact environnemental de votre site web. 