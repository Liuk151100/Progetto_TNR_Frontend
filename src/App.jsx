import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/authContext';
import EventCalendar from './pages/EventCalendar';
import NotFound from './pages/NotFound';
import AuthPages from './pages/AuthPages';
import GoogleCallback from './components/GoogleCallback';


export default function App() {
  // const getAutoTheme = () => {
  //   const hour = new Date().getHours();
  //   return hour >= 10 || hour < 7 ? 'dark' : 'light';
  // };

  // const [theme, setTheme] = useState(getAutoTheme);
  // const [userOverride, setUserOverride] = useState(false);

  // useEffect(() => {
  //   if (!userOverride) {
  //     const id = setInterval(() => setTheme(getAutoTheme()), 60000);
  //     return () => clearInterval(id);
  //   }
  // }, [userOverride]);

  // const toggleTheme = () => {
  //   setUserOverride(true);
  //   setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  // };

  return (

    <BrowserRouter>
      <AuthProvider>
        {/* <div className={`app-root ${theme}`}> */}
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/auth/google-callback" element={<GoogleCallback />} />
            <Route path='/events' element={<EventCalendar />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/Login" element={<AuthPages />} />

          </Routes>
          <Footer />
        {/* </div> */}
      </AuthProvider>
    </BrowserRouter>
  );
}