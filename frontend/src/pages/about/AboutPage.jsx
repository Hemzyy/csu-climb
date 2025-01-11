import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content mt-28">
      <header className="bg-primary text-primary-content py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">À propos</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 space-y-12">
        {/* Project Description Section */}
        <section className="bg-base-100 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">À propos du projet</h2>
          <p>
            Bienvenue sur CSU-climb ! Ce site web est un projet personnel créé
            pour le plaisir. Il vise à permettre aux grimpeurs de suivre leurs
            progrès et de se fixer des objectifs. Ce projet n'est pas affilié à
            l'université. C'est une initiative personnelle destinée aux
            grimpeurs de l'université!
          </p>
        </section>

        {/* Validation and Features Section */}
        <section className="bg-base-100 shadow-md rounded-lg p-6">
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
        <section className="bg-base-100 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
          <p className="mb-4">
            Vous avez des suggestions pour améliorer le site ? trouvé un bug ?
            ou vous avez simplement un message à partager ? Vous pouvez remplir
            le formulaire ci-dessous avec vos suggestions ou signalements.
          </p>
          <form
            action="https://csu-climb.onrender.comfeedback"
            method="POST"
            className="space-y-4"
          >
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Type du Feedback</span>
              </label>
              <select name="type" className="select select-bordered">
                <option value="bug">Bug</option>
                <option value="idea">Idea</option>
                <option value="message">General Message</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Votre Message</span>
              </label>
              <textarea
                name="message"
                rows="4"
                className="textarea textarea-bordered"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled>
              Submit Feedback (Currently Unavailable)
            </button>
          </form>
        </section>
      </main>

      <footer className="bg-base-100 text-neutral-content py-4 mx-4">
        <div className="container mx-auto text-center">
          <p className="mb-4">&copy; 2025 CSU-climb. Tous droits réservés.</p>
        </div>

        {/* social media icons from fontawesome*/}
        <div className="flex justify-center space-x-4">
          <a href="https://instagram.com/yaboihemzy" target="_blank" className="btn btn-ghost btn-circle">
            <i className="fab fa-instagram fa-2x"></i>
          </a>
          <a href="https://github.com/Hemzyy" target="_blank" className="btn btn-ghost btn-circle">
            <i className="fab fa-github fa-2x"></i>
          </a>
          <a href="https://linkedin.com/in/hamza-krika" target="_blank" className="btn btn-ghost btn-circle">
            <i className="fab fa-linkedin fa-2x"></i>
          </a>
        </div>

      </footer>
    </div>
  );
};

export default About;
