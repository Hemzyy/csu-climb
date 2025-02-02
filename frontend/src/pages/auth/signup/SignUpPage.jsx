import { Link } from "react-router-dom";
import { useState } from "react";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		password: "",
	});
	const [agreedToPrivacy, setAgreedToPrivacy] = useState(false); // État pour la case à cocher

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to sign up");
				console.log(data);
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Compte créé avec succès!");
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!agreedToPrivacy) {
			toast.error("Vous devez accepter la politique de confidentialité pour continuer.");
			return;
		}
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<h1 className='text-4xl font-extrabold text-white'>Rejoindre CSU Climb</h1>
					
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<FaUser />
						<input
							type='text'
							className='grow'
							placeholder="Nom d'utilisateur"
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Mot de passe'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>

					{/* Checkbox Politique de confidentialité */}
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="privacyPolicy"
							checked={agreedToPrivacy}
							onChange={() => setAgreedToPrivacy(!agreedToPrivacy)}
							className="w-5 h-5 accent-primary cursor-pointer"
						/>
						<label htmlFor="privacyPolicy" className="text-white text-sm">
							j'ai lu et j'accepte la{" "}
							<Link to="/privacy-policy" className="text-blue-400 underline">
								politique de confidentialité
							</Link>.
						</label>
					</div>

					<button
						className='btn rounded-full btn-primary text-white'
						disabled={!agreedToPrivacy || isPending}
					>
						{isPending ? "Loading..." : "S'inscrire"}
					</button>

					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>

				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg text-center'>Vous avez déjà un compte?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'> Se connecter </button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
