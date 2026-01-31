# Configuration de l'API Tequila by Kiwi

## Obtenir une clé API

1. **Créer un compte** sur [Tequila by Kiwi](https://tequila.kiwi.com/)
2. **S'inscrire** pour obtenir un accès API
3. **Récupérer votre clé API** depuis votre dashboard

## Configuration locale

1. Créer un fichier `.env` à la racine du projet (si ce n'est pas déjà fait)
2. Ajouter la clé API :

```env
KIWI_API_KEY=votre_cle_api_ici
PORT=3001
NODE_ENV=development
```

3. Redémarrer le serveur backend

## Configuration pour Vercel

1. Aller dans **Settings** → **Environment Variables** de votre projet Vercel
2. Ajouter la variable `KIWI_API_KEY` avec votre clé API
3. Redéployer le projet

## Mode simulation

Si aucune clé API n'est configurée ou si l'API échoue, le service bascule automatiquement en **mode simulation** avec des données réalistes générées algorithmiquement.

Cela permet au site de fonctionner même sans clé API, utile pour :
- Le développement local
- Les démos
- Le fallback en cas de panne de l'API

## Endpoints API disponibles

### `/api/search`
Recherche de vols avec comparaison direct vs hub
```
GET /api/search?from=CDG&to=JFK&date=01/03/2026
```

### `/api/locations` (à implémenter)
Recherche d'aéroports pour l'autocomplete
```
GET /api/locations?query=Paris
```

## Limites de l'API

- **Rate limits** : Vérifier les limites de votre plan Tequila
- **Quotas** : En fonction de votre abonnement
- **Données** : Les prix sont en temps réel mais peuvent varier

## Troubleshooting

**Le site affiche "Simulation mode"** :
- Vérifier que la clé API est bien configurée dans `.env`
- Vérifier que le serveur a bien chargé les variables d'environnement
- Consulter les logs du serveur pour voir les erreurs API

**Erreur "No flights found"** :
- Vérifier que les codes IATA sont valides
- Essayer avec une date future
- Vérifier que votre quota API n'est pas dépassé
