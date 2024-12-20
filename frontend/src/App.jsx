import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LoginPage';
import Navbar from './components/common/Navbar';
import ListeVoiePage from './pages/voies/ListeVoiePage';
import Voie from './pages/voies/Voie';
import Classement from './pages/classement/Classement';

import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
	const {data:authUser, isLoading }= useQuery({
		// we use queryKey to give a name to the query so we can invalidate it later
		queryKey: ['authUser'],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	})

	if (isLoading) {
		return(
			<div className='h-screen flex justify-center items-center'>	
			<LoadingSpinner size='lg' />
			</div>
		)
	}


	return (
		<div className='flex max-w-6xl mx-auto'>
        {/* common components because its not wrapped with routes*/}
			{ authUser && <Navbar /> }
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/listevoies' element={authUser ? <ListeVoiePage /> : <Navigate to='/' />} />
				<Route path='/voie/:id' element={authUser ? <Voie /> : <Navigate to='/' />} />
				<Route path='/classement' element={authUser ? <Classement /> : <Navigate to='/' />} />
			</Routes>

	  		<Toaster />
		</div>
	);
}

export default App;