import { Route, Routes } from 'react-router-dom'

import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/login/LoginPage'
import SignupPage from './pages/auth/signup/SignUpPage'

function App() {

  return (
    <div className="flex mx-auto m-0 p-0">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  )
}

export default App
