import { useState } from "react";
import LoadingSpinner from "./../../../components/common/LoadingSpinner"; // Import your spinner component
import toast from "react-hot-toast"; // Import react-hot-toast

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [animateForm, setAnimateForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading spinner
        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setIsLoading(false); // Stop loading spinner

        if (res.ok) {
            toast.success("Un lien de réinitialisation a été envoyé à votre email!"); // Success toast
        } else {
            toast.error(data.error || "Erreur lors de l'envoi du lien de réinitialisation."); // Error toast
        }
    };

    const handleArrowclick = () => {
        setAnimateForm(true);
        setTimeout(() => setAnimateForm(false), 1000);
    };

    return (
        <div className="max-w-screen-xl mx-auto flex flex-col h-screen">
            {/* Forgot password form */}
            <div id="forgot-password-form" className={`flex-1 flex flex-col justify-center items-center pb-32 mt-40 ${animateForm ? "motion-preset-slide-right motion-delay-500" : ""}`}>
                <form onSubmit={handleSubmit} className="flex gap-4 flex-col w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-extrabold text-center mb-4">Réinitialiser le mot de passe</h1>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Entrez votre email"
                        required
                        className="input input-bordered rounded-lg w-full p-3 mb-4 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary w-full py-3 rounded-lg text-white mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? <LoadingSpinner /> : "Envoyer le lien de réinitialisation"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
