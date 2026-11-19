# Google Analytics 4 — portfolio

## Ce que contenait l'ancien site

L'ancien thème utilisait Google tag (gtag.js) dans le fichier `themes/raditian-free-hugo-theme-data-science/layouts/partials/head.html`. Il chargeait `gtag.js`, initialisait `dataLayer`, puis exécutait `gtag('config', ...)`.

L'identifiant était injecté depuis `googleAnalyticsID` dans `config.yaml`. Or cette valeur était vide dans l'ancien dépôt : aucun identifiant GA4 actif n'a donc pu être extrait ou migré.

## Configuration du nouveau site

Le nouveau site charge `dist/analytics.js` depuis `dist/index.html`. Pour activer la collecte :

1. Ouvre Google Analytics et sélectionne la propriété GA4 du portfolio, ou crée-en une.
2. Dans **Administration → Flux de données → Web**, récupère l'identifiant de mesure au format `G-XXXXXXXXXX`.
3. Ouvre `dist/analytics.js` et remplace la constante `GA_MEASUREMENT_ID = "G-XXXXXXXXXX"` par ton vrai identifiant.
4. Publie le dépôt sur Netlify. Le dossier de publication est déjà configuré sur `dist` dans `netlify.toml`.

Tant que le marqueur `G-XXXXXXXXXX` n'est pas remplacé, aucun appel réseau vers Google Analytics n'est effectué et aucune statistique ne remonte.

## Événements suivis

Après acceptation des statistiques, le site envoie :
- `page_view` : affichage de la page ;
- `project_open` : clic dans une carte projet ;
- `cv_download` : téléchargement du CV ;
- `contact_click` : clic sur l'e-mail ou le téléphone ;
- `outbound_click` : clic sur un lien externe.

Le chargement Google est différé jusqu'à l'acceptation. Le consentement est refusé par défaut pour `analytics_storage`, `ad_storage`, `ad_user_data` et `ad_personalization`. Le choix du visiteur est conservé localement et peut être modifié via **Gérer les cookies** en bas de page. Aucun événement Analytics n'est envoyé tant que le consentement n'est pas accordé.

## Vérification

Après avoir renseigné l'identifiant et publié :
1. Ouvre le portfolio en navigation privée.
2. Refuse les statistiques : aucun tag Google Analytics ne doit être chargé.
3. Recharge, accepte les statistiques, puis consulte le rapport **Temps réel** de GA4.
4. Clique sur une carte projet, le CV et les coordonnées pour vérifier les événements.

La configuration du consentement doit être testée sur le domaine réellement publié. Cette implémentation technique ne remplace pas la validation de la politique de confidentialité ni l'analyse des obligations applicables aux traceurs.

## Tableau de bord privé

La page `/admin` n'est pas incluse dans cette modification. Les rapports sont disponibles dans Google Analytics. Un tableau de bord maison nécessitera une authentification et un backend sécurisé utilisant l'API Google Analytics Data ; aucun secret de service ne devra être placé dans les fichiers JavaScript publics.
