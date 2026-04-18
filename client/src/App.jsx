import React from 'react'
import { Route , Routes } from 'react-router-dom'
import Home  from './pages/home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import { getCurrentUser } from './services/api'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from "react-router-dom";
export const serverUrl = import.meta.env.VITE_API_URL
import History from "./pages/History";
import Pricing from "./pages/Pricing";
import Notes from "./pages/Notes";
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'

function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
     getCurrentUser(dispatch)
  },[dispatch])

  const {userData} = useSelector((state)=>state.user)
  console.log(userData)
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/auth"
          element={!userData ? <Auth /> : <Navigate to="/" replace />}
        />
        <Route
          path="/history"
          element={userData ? <History /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/pricing"
          element={userData ? <Pricing /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/notes"
          element={userData ? <Notes /> : <Navigate to="/auth" replace />}
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
      </Routes>
    </>
  );
}

export default App