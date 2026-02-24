# PrixTrack 📈

Tracker de prix en temps réel — style trading — pour les billets de train SNCF et composants tech (GPU/RAM).

## Fonctionnalités

### 🚄 Trains France
- Suivi en temps réel de 11 routes TGV majeures
- Graphique de trading interactif (Chart.js)
- Ticker défilant avec toutes les routes
- Watchlist des routes populaires
- Carnet d'ordres simulé
- Statistiques : ouverture, plus haut, plus bas, variation
- Sparklines sur chaque carte de route

### 💻 Tech & GPU / RAM
- Suivi de 6 cartes graphiques (Nvidia & AMD)
- Suivi de 4 kits mémoire (DDR4 & DDR5)
- Graphique principal interactif
- Sparklines par produit

### 📱 Mobile-first
- Interface responsive optimisée mobile
- Navigation par onglets
- Ticker condensé sur petit écran

## Déploiement sur Render

### Méthode 1 : render.yaml (recommandée)
1. Poussez ce repo sur GitHub
2. Allez sur [render.com](https://render.com)
3. New → Web Service → connectez votre repo
4. Render détectera automatiquement le `render.yaml`
5. Deploy!

### Méthode 2 : Manuel
1. New Web Service sur Render
2. Runtime: **Node**
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment: `PORT=3000`

## Développement local

```bash
npm install
node server.js
# Ouvre http://localhost:3000
```

## Architecture

```
traintracker/
├── server.js          # Express API + génération de prix simulés
├── public/
│   └── index.html     # Frontend complet (HTML/CSS/JS + Chart.js)
├── package.json
├── render.yaml
└── README.md
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/routes` | Liste de toutes les routes |
| `GET /api/train/:route` | Prix et historique d'une route |
| `GET /api/tech` | Prix de tous les composants tech |
| `GET /api/tech/:product` | Prix et historique d'un composant |

## Extension avec données réelles

Pour connecter de vraies données :
- **SNCF** : Utiliser l'API SNCF Connect ou scraper les prix TGV-MAX/Ouigo
- **GPU/RAM** : APIs de prix comme CamelCamelCamel, LDLC, Grosbill
- Les prix sont mis à jour toutes les minutes via `node-cron`
- Stockez les prix dans une base PostgreSQL (Render offre un plan gratuit)

## Notes

Les prix actuels sont **simulés** avec un algorithme de bruit de marché réaliste pour démonstration. En production, remplacez `generatePrice()` par de vraies sources de données.
