# GA4 — configuration du portfolio

L'ancien thème utilisait Google tag (gtag.js), mais la valeur `googleAnalyticsID` dans son `config.yaml` était vide. Aucun identifiant de mesure existant n'a donc pu être migré.

## Mise en place

1. Créer ou choisir une propriété Google Analytics 4 pour le site.
2. Créer un flux Web pour le domaine final.
3. Copier l'identifiant de mesure au format `G-XXXXXXXXXX`.
4. Dans `dist/index.html`, remplacer `G-XXXXXXXXXX` par cet identifiant uniquement dans les deux emplacements prévus du bloc Google tag.
5. Publier le dossier `dist` avec Netlify.

Le bloc GA4 est chargé avec `send_page_view: false`. Le fichier `dist/script.js` envoie ensuite une seule vue de page initiale, et des événements personnalisés pour les interactions des projets, le téléchargement du CV, l'ouverture des contacts et les liens sortants.

## Confidentialité et consentement

Le tag respecte le Consent Mode avec un état initial refusé pour `analytics_storage`. Le site ne charge pas le tag Analytics tant que l'utilisateur n'a pas accepté les cookies analytiques via le bandeau de consentement. Le choix est enregistré localement pour éviter de redemander à chaque navigation. Le lien « Gérer les cookies » permet de rouvrir le choix.

Cette intégration technique ne remplace pas la vérification juridique du bandeau, de la politique de confidentialité et des règles applicables aux traceurs sur le site publié.

## Tableau de bord privé

Cette configuration GA4 ne crée pas une page d'administration. Les rapports doivent être consultés dans Google Analytics. Une page /admin privée nécessiterait une authentification et un accès serveur aux données GA4 via l'API Data, avec secrets conservés côté serveur — jamais dans le JavaScript public.
