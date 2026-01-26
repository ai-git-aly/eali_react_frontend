import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import NewsManager from './pages/admin/NewsManager';
import TendersManager from './pages/admin/TendersManager';
import PartnersManager from './pages/admin/PartnersManager';
import ProgramsManager from './pages/admin/ProgramsManager';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

// Animated page wrapper component
const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-primary/30 selection:text-brand-primary">
        {!isAdminRoute && <Navbar />}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AnimatedPage><AdminLogin /></AnimatedPage>} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="news" element={<NewsManager />} />
              <Route path="tenders" element={<TendersManager />} />
              <Route path="partners" element={<PartnersManager />} />
              <Route path="programs" element={<ProgramsManager />} />
            </Route>
          </Routes>
        </AnimatePresence>
        {!isAdminRoute && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;