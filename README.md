# 🚀 SmartHub - Système Intelligent de Hubs de Voyage

SmartHub est une plateforme innovante qui aide les voyageurs à trouver des vols moins chers en identifiant les meilleures correspondances via des hubs internationaux. Le système compare les trajets directs avec des itinéraires incluant une escale stratégique pour maximiser les économies.

## 📁 Structure du Projet

```
SmartHub/
├── client/          # Frontend React (Vite, Tailwind CSS, Leaflet)
├── server/          # Backend Express (Node.js, Tequila API by Kiwi)
├── package.json     # Configuration racine pour orchestrer le projet
└── README.md        # Documentation générale
```

## 🛠️ Installation et Démarrage Rapide

### 1. Installation des dépendances
À la racine du projet, lancez la commande suivante pour tout installer :
```bash
npm run install:all
```
*Note : Cela installe les dépendances à la racine, dans le dossier client et dans le dossier serveur.*

### 2. Configuration (Optionnel)
Pour utiliser les données réelles de Kiwi :
1. Allez dans `server/`.
2. Créez un fichier `.env`.
3. Ajoutez votre clé API : `KIWI_API_KEY=votre_cle_api_ici`.
*Si aucune clé n'est fournie, le système passera automatiquement en mode simulation pour rester opérationnel.*

### 3. Lancement du Projet
Pour lancer à la fois le serveur et le client avec une seule commande :
```bash
npm run dev
```

- **Frontend** : [http://localhost:5173](http://localhost:5173)
- **Backend API** : [http://localhost:3001](http://localhost:3001)

## ✨ Fonctionnalités Clés

- 🛫 **Recommandations Intelligentes** : Algorithme de recherche basé sur les hubs de Kiwi.
- 💰 **Comparaison de Prix** : Visualisation directe des économies réalisées (Direct vs Hub).
- 🗺️ **Carte Interactive** : Visualisation des trajets sur une carte dynamique.
- 🌍 **Support Multi-langues** : Support complet du Français, Anglais, Espagnol, Allemand et Portugais.
- 📱 **Design Responsive** : Optimisé pour PC, Tablettes et Smartphones.

## 🔌 API Endpoints principaux

| Point de terminaison | Méthode | Description |
|----------------------|---------|-------------|
| `/api/hubs`          | GET     | Liste des hubs principaux. |
| `/api/search`        | GET     | Recherche de vols via Tequila (requiert `from`, `to`, `date`). |
| `/api/compare`       | GET     | Comparaison de prix entre direct et hub. |
| `/health`            | GET     | État de santé du serveur. |

---
**Développé pour l'efficacité et la clarté. Bon voyage !**
