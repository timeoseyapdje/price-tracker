# TOEIC Master — Objectif 990/990

Application web statique (HTML/CSS/JS vanilla, sans backend) pour réviser le
TOEIC au niveau C1, en visant un score proche de 990/990.

## Fonctionnalités

- **Banque de 66 questions** originales de type TOEIC :
  - Part 5 — grammaire, phrase à trous, 4 choix (44 questions)
  - Part 6 — texte à trous, 4 passages x 4 questions liées au contexte (16 questions)
  - Part 7 — compréhension de texte courte, 2 passages x 3 questions (6 questions)
- Tirage **aléatoire sans répétition immédiate** (toutes les questions du filtre
  courant sont vues avant qu'un nouveau tirage ne les remélange).
- **Feedback immédiat** (bonne/mauvaise réponse) avec courte explication
  grammaticale à chaque question.
- **Mode chronométré** :
  - Timer global de session obligatoire (10 / 20 / 30 min)
  - Timer par question optionnel (désactivé / 45 s / 60 s)
  - Temps restant affiché en continu
- **Statistiques détaillées** : score, pourcentage, temps moyen par question,
  historique des sessions stocké en `localStorage`.
- **Analyse des lacunes par catégorie** (temps verbaux, conditionnels, voix
  passive, prépositions, relatives, connecteurs logiques, phrasal verbs,
  vocabulaire bureau/réunions, voyage/transport, finance/achats, RH,
  compréhension écrite) avec barres de réussite par catégorie et
  identification automatique des 2-3 catégories les plus faibles.
- **Session ciblée** en un clic sur les catégories les plus faibles, depuis
  l'écran de résultats ou depuis l'écran d'accueil (basé sur l'historique).
- Design **mobile-friendly**, aucune dépendance externe.

## Utilisation

Aucune installation ni backend n'est nécessaire : il s'agit de fichiers
statiques situés dans `public/` (`index.html`, `style.css`, `app.js`,
`questions.js`).

- Ouvrir directement `public/index.html` dans un navigateur, ou
- Servir le dossier avec n'importe quel serveur statique, par exemple :

```bash
cd public && python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

Le déploiement fonctionne avec n'importe quel hébergeur de fichiers statiques
(GitHub Pages, Netlify, Vercel, etc.).

## Données

Tout est stocké localement dans le navigateur (`localStorage`) : aucune donnée
n'est envoyée à un serveur. L'historique des sessions peut être effacé depuis
l'écran « Historique ».
