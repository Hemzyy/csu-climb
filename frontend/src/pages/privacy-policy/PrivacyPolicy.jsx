import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Politique de Confidentialité</h1>
      <p className="text-sm text-gray-500 mb-6">Dernière mise à jour : 2 Février 2025</p>
      
      <p className="mb-4">
        Bienvenue sur <strong>CSU Climb</strong>. La protection de vos données personnelles est une priorité.
        Cette politique de confidentialité explique quelles données sont collectées, comment ces données sont utilisées et stockées, et quels sont vos droits. 
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Données personnelles collectées</h2>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Nom d'utilisateur :</strong> permet d'identifier les utilisateurs et d'interagir avec la communauté.</li>
        <li><strong>Adresse e-mail :</strong> nécessaire pour la récupération de mot de passe et les notifications (événements, mises à jour).</li>
        <li><strong>Photo de profil (optionnelle) :</strong> sert à personnaliser votre profil.</li>
        <li><strong>Activité d'utilisation :</strong> les voies validées pour attribuer des points et classer les utilisateurs.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Utilisation des données</h2>
      <p className="mb-4">Vos données personnelles sont utilisées pour :</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Gérer votre compte utilisateur.</li>
        <li>Permettre l'identification et l'interaction avec d'autres utilisateurs.</li>
        <li>Envoyer des communications liées à l'application (réinitialisation de mot de passe, événements, mises à jour).</li>
        <li>Gérer le classement des utilisateurs en fonction de leur activité.</li>
      </ul>
      <p><strong>Nous ne partageons pas vos données avec des tiers sans votre consentement.</strong></p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Stockage et sécurisation des données</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Les mots de passe sont chiffrés avec <strong>bcryptjs</strong> et stockés de manière sécurisée.</li>
        <li>Les données sont stockées sur <strong>MongoDB</strong>, et les photos de profil sur <strong>Cloudinary</strong>.</li>
        <li>L'application est hébergée sur <strong>Render.com</strong>, qui utilise HTTPS pour sécuriser les communications.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Vos droits</h2>
      <p>Conformément au RGPD, vous avez le droit de :</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Accéder aux données que nous possédons sur vous.</li>
        <li>Modifier votre nom d'utilisateur et votre adresse e-mail dans votre profil.</li>
        <li>Demander la suppression de votre compte et de vos données en <a href="mailto:hamza.krika@etu.unistra.fr" className="text-blue-800 underline"> nous contactant directement</a> ou via le formulaire de contact.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Cookies et authentification</h2>
      <p className="mb-4">L'application utilise <strong>uniquement un cookie d'authentification</strong> via <strong>cookie-parser</strong> pour vérifier votre identité. Aucun suivi publicitaire ou cookie tiers n'est utilisé.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Contact</h2>
      <p>Pour toute question ou demande concernant vos données personnelles, vous pouvez nous contacter à l'adresse suivante :<a href="mailto:hamza.krika@etu.unistra.fr" className="text-blue-800"> hamza.krika@etu.unistra.fr</a></p>
    </div>
  );
};

export default PrivacyPolicy;
