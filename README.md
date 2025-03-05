# Projet : Application de Suivi des Voies d'Escalade

## 📝 Description du Projet

Cette application est une plateforme dédiée aux grimpeurs de la salle d'esclade du CSU (centre sportif universitare de l'Université de Strasbourg) qui souhaitent suivre leurs performances, valider les voies qu'ils ont réussies, et monter dans le classement. L'application permet aux utilisateurs de :

- **Valider les voies** qu'ils ont réussies et gagner des points.
- **Consulter leur profil** avec des statistiques détaillées (nombre de voies validées, points, classement, etc.).
- **Explorer les voies récemment ouvertes** dans leur salle d'escalade.
- **Participer à un classement** pour comparer leurs performances avec d'autres grimpeurs.
- **Filtrer et trier les voies** par secteur, niveau de difficulté, et date d'ouverture.

L'application est conçue pour être intuitive, responsive, et facile à utiliser, que ce soit sur mobile ou sur ordinateur.

---

## 📸 Captures d'Écran
<div style="display: flex; justify-content: space-around;">
  <img src="/frontend/public/screenshots/ss1.png" alt="HomePage" width="300" />
  <img src="/frontend/public/screenshots/ss2.png" alt="ListeVoies" width="300" />
  <img src="/frontend/public/screenshots/ss3.png" alt="Voie" width="300" />
</div>

---

## 🛠 Technologies Utilisées

### Frontend
- **React.js** : Bibliothèque JavaScript pour la construction de l'interface utilisateur.
- **Tailwind CSS** : Framework CSS pour un design moderne et responsive.
- **React Router** : Gestion des routes pour une navigation fluide entre les pages.
- **React Hot Toast** : Affichage de notifications pour une meilleure expérience utilisateur.
- **Axios** : Gestion des requêtes HTTP vers l'API backend.

### Backend
- **Node.js** : Environnement d'exécution JavaScript pour le serveur.
- **Express.js** : Framework pour la création de l'API RESTful.
- **MongoDB** : Base de données NoSQL pour stocker les données des utilisateurs, des voies, et des classements.
- **Mongoose** : Bibliothèque pour la modélisation des données MongoDB.
- **JWT (JSON Web Tokens)** : Authentification sécurisée des utilisateurs.

### Autres Outils
- **TanStack Query (React Query)** : Gestion des requêtes asynchrones et de la mise en cache des données.
- **Git** : Gestion des versions du projet.

---

## 🚀 Fonctionnalités Principales

### 1. **Validation des Voies**
   - Les utilisateurs peuvent valider les voies qu'ils ont réussies.
   - Chaque voie validée rapporte des points en fonction de sa difficulté.

### 2. **Classement**
   - Un classement affiche les meilleurs grimpeurs en fonction de leurs points.
   - Les utilisateurs peuvent voir leur position dans le classement.
   - Les utilisateurs peuvent choisir s'ils veulent étre masqués ou affichés dans le classement.

### 3. **Profil Utilisateur**
   - Chaque utilisateur a un profil personnalisé avec :
     - Une photo de profil.
     - Le nombre de voies validées.
     - Leur score total.
     - Leur position dans le classement.

### 4. **Exploration des Voies**
   - Les utilisateurs peuvent explorer les voies récemment ouvertes dans leur salle d'escalade.
   - Les voies peuvent être filtrées par secteur et triées par niveau de difficulté ou date d'ouverture.

### 5. **Authentification Sécurisée**
   - Les utilisateurs peuvent s'inscrire, se connecter, et réinitialiser leur mot de passe.
   - L'authentification est gérée via JWT pour une sécurité optimale.

### 6. **Interface Responsive**
   - L'application est entièrement responsive et s'adapte à tous les écrans (mobile, tablette, ordinateur).

---

## 🖥 Comment Fonctionne l'Application ?

### 1. **Authentification**
   - Les utilisateurs doivent créer un compte ou se connecter pour accéder aux fonctionnalités de l'application.
   - Une fois connectés, ils peuvent valider des voies et consulter leur profil.

### 2. **Validation des Voies**
   - Les utilisateurs sélectionnent une voie dans la liste des voies disponibles.
   - Après avoir validé une voie, leur score est mis à jour, et leur profil est actualisé.

### 3. **Classement**
   - Le classement est mis à jour en temps réel en fonction des points des utilisateurs.
   - Les utilisateurs peuvent voir leur position et comparer leurs performances avec d'autres grimpeurs.

### 4. **Filtrage et Tri**
   - Les utilisateurs peuvent filtrer les voies par secteur (gauche, central, droit) et par niveau de difficulté.
   - Ils peuvent également trier les voies par date d'ouverture ou par points de difficulté.

### 5. **Profil Utilisateur**
   - Le profil affiche les statistiques de l'utilisateur, y compris le nombre de voies validées, leur score total, et leur position dans le classement.

---
