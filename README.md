# GreenTrackr V2.0.0 

GreenTrackr est une extension navigateur eco-conçue qui vous permet de calculer l’empreinte carbone de votre site web en un clic. L'évaluation se base sur l'estimation de la consommation énergétique (Wh) de trois paramètres qui représentent chaque tiers de l'architecture d'un service numérique : 
- L’**utilisateur** : les données reçues (**taille de la page décompressée**)
- Le **réseau** : les données transférées (**taille de la page compressée**)
- Le **serveur** : le nombre de requêtes (**HTTP**) 

GreenTrackr interagisse avec deux **API** externe pour déterminer le mix énergétique du pays qui héberge le site et celui dans lequel se trouve l'utilisateur : 
**CO2signal d’Electricity Map** et **IP Geolocation**.

Pour les informations concernant les calculs de GreenTrackr, se référer à https://conserto.pro/greentrackr/

## Tutoriel

### Utiliser l'extension

- Ouvrir les outils de développement du navigateur (DevTools) : ```Ctrl+Shift+I```
- Quatre côtés d'épinglage de la Devtools possible (appuyez sur les trois dots verticals $\vdots$ pour choisir un)
  - nous vous recommandons de la détacher sur une **fenêtre distincte**
- Dans l'onglet **Réseau** de la DevTools décocher la case **Désactiver le cache**
- Dans le navigateur, aller sur le site Web à analyser et accéder à l'extension GreenTrackr dans les onglets de la DevTools
- Configurer GreenTrackr dans l'onglet **Paramètre**, deux paramètres nécessaires :
  - Un token d'accès de l'API 'CO2signal' de 'Electricity Maps', suivre le lien puis aller sur '**Go to api portal**' ->  https://www.co2signal.com/
  - Le nombre d'essais pour analyser les requêtes de la page courante
- GreenTrackr propose 3 options (onglets) : **Evaluation/Page**, **Auto scroll/Page**, **Parcours Utilisateur**

#### Evaluation/Page
- Deux types d'évaluation : **avec cache** et **sans cache** 
  - **Evaluation avec cache** : cliquer directement sur le bouton "**Analyser**"
  - **Evaluation sans cache** : cliquer sur le bouton "**supprimer le cache**" ensuite sur le bouton "**Analyser**" 
- Les résultats s'affichent.
- Vous pouvez sauvegarder ce résultat dans un historique via le bouton "**Enregistrer l'évaluation**".
- L'historique des résultats sauvegardés est disponible via le bouton "**Voir l'historique**".
- Le bouton "**Réinitialiser la mesure**" permet de remettre à zero les compteurs de calcul


#### Auto scroll/Page

Vous pouvez analyser avec précisions la page web en saisissant un pourcentage pourcentage (**%**), les résultats sont obtenus suivant le même processe que l'option **Evaluation/Page**.

#### Parcours Utilisateur

Vous pouvez calculer l'empreinte carbone d'un parcours utilisateur en allant sur l'onglet "**Parcours Utilisateur**". En démarrant l'analyse, en cliquant sur le bouton "**Démarrer l'enregistrement**", l'extension enregistrera le parcours effectué. Une fois le parcours terminé, l'appui sur le bouton "**Stopper l'enregistrement**" permet d'afficher le tableau des résultats pour chaque action effectuée : "**(scroll)**" et/ou "**(click)**" sur les pages visitées. Les boutons "**Réinitialiser le parcours**" et "**Supprimer le cache**" permet de vider les résultats stockés en local et ainsi de redémarrer un parcours à zéro.

### Points à noter

- Le choix d'épinglage de la DevTools a une influence sur le résultat : chargement des ressources est différent (nombre de requêtes, taille de la page, ...) 
- Penser à faire un rechargement de la page
- L'utilisation d'un bloqueur de publicité ou autre filtre a une influence sur le résultat.

### Permissions de l'extension

Pour fonctionner, l'extension utilise les permissions suivantes :

- activeTab, tabs : utilisée pour afficher la page des analyses sauvegardées et pour accéder aux contenus des pages pour l'analyse.
- <all_urls> : utilisée pour accéder aux Urls pour l'analyse.
- browsingData : utilisée pour vider le cache du navigateur.
- storage : utilisée pour stocker les différentes mesures.
- webNavigation: utilisée pour détecter la fin du chargement de la page analysée.
