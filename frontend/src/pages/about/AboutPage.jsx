import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from 'react-hot-toast';

const About = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"], queryFn: () => fetchData("/api/auth/me") });
  const [type, setType] = useState("bug");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      setStatus({ success: false, message: "Vous devez être connecté pour envoyer un feedback." });
      return;
    }

    try {
      const response = await fetch("/api/feedback/createFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackText: message,
          userId: authUser._id,
          userName: authUser.username,
          type,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus({ success: true, message: "Feedback envoyé avec succès ! Merci pour votre contribution." });
        toast.success("Feedback envoyé avec succès!");
        setMessage(""); // Clear the message field after success
      } else {
        setStatus({ success: false, message: result.error || "Une erreur s'est produite." });
      }
    } catch (error) {
      setStatus({ success: false, message: "Erreur serveur. Veuillez réessayer plus tard." });
    }
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content mt-28 sm:pb-4 pb-20">
      <header className="bg-primary text-primary-content py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">À propos</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 space-y-12">
        {/* Project Description Section */}
        <section className="bg-base-100 shadow-md rounded-lg p-6 motion-preset-slide-up">
          <p className="text-xl font-semibold text-center">
            ⚠️ Ce site est toujours en cours de développement et continuera à être amélioré.
          </p>
        </section>

        <section className="bg-base-100 shadow-md rounded-lg p-6 motion-preset-slide-up motion-delay-100">
          <h2 className="text-2xl font-semibold mb-4">À propos du projet</h2>
          <p>
            Bienvenue sur CSU-climb ! Ce site web est un projet personnel.
            Il vise à permettre aux grimpeurs de suivre leurs
            progrès et de se fixer des objectifs. Ce projet n'est pas affilié à
            l'université.
          </p>
        </section>

         {/* Validation and Features Section */}
         <section className="bg-base-100 shadow-md rounded-lg p-6 motion-preset-slide-up motion-delay-200">
          <h2 className="text-2xl font-semibold mb-4">Guide d'utilisation</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Validation d'une voie:</strong> Connectez-vous à votre
              compte, sélectionnez la voie que vous avez complétée et cliquez
              sur le bouton contenant le symbole ✅. Une voie est considérée
              comme validée lorsque vous arriver à la grimper en une fois sans
              vous arrêter et sans tomber.
            </li>
            <li>
              <strong>Afficher ou masquer le classement:</strong> Vous avez la
              liberté de choisir si vous souhaitez être affiché dans le
              classement ou non. Pour cela, rendez-vous dans votre profil et
              appuyez sur le bouton "Afficher dans le classement".
            </li>
          </ul>
        </section>

        {/* Feedback Section */}
        <section className="bg-base-100 shadow-md rounded-lg p-6 motion-preset-slide-up motion-delay-300">
          <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
          <p className="mb-4">
            Vous avez des suggestions pour améliorer le site ? Trouvé un bug ? 
            Ou vous avez simplement un message à partager ? Remplissez le formulaire ci-dessous !
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Type du Feedback</span>
              </label>
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="select select-bordered"
              >
                <option value="bug">Bug</option>
                <option value="idea">Idée</option>
                <option value="generalMessage">Message Général</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Votre Message</span>
              </label>
              <textarea
                name="message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="textarea textarea-bordered"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Envoyer le Feedback
            </button>
          </form>
          {status && (
            <p
              className={`mt-4 text-center ${
                status.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.message}
            </p>
          )}
        </section>
      </main>

      <footer className="bg-base-100 text-neutral-content py-4 mx-4">
        <div className="container mx-auto text-center">
          <p className="mb-4">&copy; 2025 CSU-climb. Tous droits réservés.</p>
        </div>
        {/* Social media icons */}
        <div className="flex justify-center space-x-4">
          <a
            href="https://instagram.com/yaboihemzy"
            target="_blank"
            className="btn btn-ghost btn-circle"
          >
            <i className="fab fa-instagram fa-2x"></i>
          </a>
          <a
            href="https://github.com/Hemzyy"
            target="_blank"
            className="btn btn-ghost btn-circle"
          >
            <i className="fab fa-github fa-2x"></i>
          </a>
          <a
            href="https://linkedin.com/in/hamza-krika"
            target="_blank"
            className="btn btn-ghost btn-circle"
          >
            <i className="fab fa-linkedin fa-2x"></i>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default About;