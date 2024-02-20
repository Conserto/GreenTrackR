# GreenTrackr for Manifest V3

### Tester l'extension

**Attention :** Cette version de l'extension n'est compatible qu'avec _Manifest V3 (Chromium)_. Une version spécifique pour _Firefox / Manifest V2_ sera disponible séparément.

- Chrome >
  [Installation de l'extension](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/)

- Edge >
  [Installation de l'extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)

### Utiliser l'extension

- Ouvrir les outils de développement du navigateur.
- Aller dans l'onglet "Evaluation/Page".
- Dans le navigateur, aller sur la page à analyser.
- Dans l'onglet "Evaluation/Page" des outils de développement, cliquer sur le bouton "Démarrer l'analyse".
- Les résultats s'affichent.
- Vous pouvez sauvegarder ce résultat dans un historique (seuls les indicateurs sont enregistrés) via le bouton "Enregistrer l'évaluation".
- L'historique des résultats sauvegardés est disponible via le bouton "Voir l'historique".

Quelques points de vigilance

- Si le nombre de requêtes est à zéro, c'est probablement parce que vous n'avez pas chargé la page avec les outils de développement démarrés. Il faut donc penser à faire un rechargement de la page.
- Pour avoir des évaluations correctes, il faut préalablement vider le cache du navigateur (Dans le cas contraire, le volume transféré va être réduit si vous avez déjà consulté le site mesuré). Pour vous éviter d'aller dans les menus du navigateur, un bouton est prévu à cet effet dans l'extension "Réinitialiser les paramètres".
- L'utilisation d'un bloqueur de publicité ou autre filtre a une influence sur le résultat.

### Résultats différents entre deux analyses

Le plugin effectue son analyse sur la base des données fournies par l'API du navigateur et, ce faisant, témoigne de la réalité constatée au moment de l'analyse dans le navigateur qui l'exécute. Lorsque l'on fait deux fois l'analyse d'un même site, le résultat peut être différent. Parmi les causes possibles, on notera par exemple:

- Les mécanismes de mise à jour en continu (Même si le site semble avoir chargé, le chargement d’autres éléments peut toujours être en cours au lancement de l’analyse. Le volume de données téléchargées et le nombre de requêtes dépendent donc du moment où vous cliquez sur le bouton "Démarrer l'analyse"). Le même effet s’applique si vous lancez l’analyse avant la fin de chargement du site.
- Les publicités qui peuvent changer entre deux analyses (la localisation, l'heure de la journée, visites précédentes avec son navigateur et bien d'autres paramètres qui sont pris en compte par les spécialistes du retargeting vont se traduire par le chargement en cascade de librairies \*.js différentes et de l'affichage de contenus publicitaires différents).
- Le scrolling : si vous réalisez un scrolling au moment de l'analyse, vous risquez de lancer des chargements de données qui n’auraient normalement pas eu lieu.
- Le niveau de "privacy" qui, selon le niveau paramétré et selon le navigateur, induira lui aussi des effets de bord.
- Les effets de cache.

### Enregistrement du parcours utilisateur

Vous pouvez quantifier les impacts environnementaux d'un parcours utilisateur en allant sur l'onglet "Parcours Utilisateur". En démarrant l'analyse, en cliquant sur le bouton "Démarrer l'enregistrement d'un parcours", l'extension enregistrera les résultats pour chaque URL visitée. Une fois le parcours terminé, l'appui sur le bouton "Stopper l'enregistrement" permet d'afficher le tableau des résultats pour chaque URL, ainsi que les différents totaux. "Réinitialiser le parcours" permet de vider les résultats stockés en local et ainsi de redémarrer un parcours à zéro.

### Permissions de l'extension

Pour fonctionner, l'extension utilise les permissions suivantes :

- activeTab, tabs : utilisée pour afficher la page des analyses sauvegardées et pour accéder aux contenus des pages pour l'analyse.
- <all_urls> : utilisée pour accéder aux Urls pour l'analyse.
- browsingData : utilisée pour vider le cache du navigateur.
- storage : utilisée pour stocker les différentes mesures.
- webNavigation: utilisée pour détecter la fin du chargement de la page analysée.
