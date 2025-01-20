import { useState } from "react";
import { Link } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { BsArrowDown } from "react-icons/bs";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate: loginMutation, isPending, isError, error } = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Failed to login");
				}
			}
			catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			// refetch the authUser query
			queryClient.invalidateQueries({ queryKey: ['authUser'] });
			//this will run the query in app.jsx
		},
	})

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const scrollToLogin = () => {
		document.getElementById("login-form").scrollIntoView({ behavior: "smooth" });
	};

	//loginform expand animation
	const [animateForm, setAnimateForm] = useState(false);
	const handleArrowclick = () => {
		scrollToLogin();
		setAnimateForm(true);
		setTimeout(() => setAnimateForm(false), 1000);
	}

	return (
		<div className='max-w-screen-xl mx-auto flex flex-col h-screen'>

			{/* short description */}
			<div className="flex flex-col items-center justify-center text-center px-4 py-8 text-white min-h-screen motion-preset-expand motion-delay-100">
				<h1 className="text-4xl font-bold mb-4">Bienvenue sur CSU Climb !</h1>
				<p className="text-lg mb-4 motion-preset-slide-right motion-delay-500">
					✔️ <strong>Validez vos voies</strong>  au mur d'escalade et accumulez des points. <br />
					🏆 <strong>Progressez dans le classement</strong>  Et suivez votre progression. <br />
					🤝 <strong>Participez à des contests</strong> : directement via l'application.
				</p>
				<button 
					onClick={handleArrowclick}
					className="btn btn-primary rounded-full text-white px-6 py-2 animate-bounce mt-6"
				>
					<BsArrowDown className="text-3xl" />
				</button>
			</div>

			{/* login form */}
			{/* <div id="login-form" className="flex-1 flex flex-col justify-center items-center pb-32"> */}
			<div id="login-form" className={`flex-1 flex flex-col justify-center items-center pb-32 ${animateForm ? "motion-preset-slide-right motion-delay-500" : ""}`}>
				<form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
					{/* <XSvg className='w-24 lg:hidden fill-white' /> */}
					<h1 className="text-4xl font-extrabold text-white">Connectez vous</h1>
					<label className="input input-bordered rounded flex items-center gap-2">
						<FaUser />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className="input input-bordered rounded flex items-center gap-2">
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className="btn rounded-full btn-primary text-white">
						{isPending ? "Loading..." : "Se connecter"}
					</button>
					{isError && <p className='text-red-500'>
						{error.message}
					</p>}
				</form>
				<div className="flex flex-col gap-2 mt-4">
					<p className='text-white text-lg'>Pas de compte ?</p>
					<Link to='/signup'>
						<button className="btn rounded-full btn-primary text-white btn-outline w-full"> Créer un compte</button>
					</Link>
				</div>
			</div>
		</div>
	);
};	
export default LoginPage;