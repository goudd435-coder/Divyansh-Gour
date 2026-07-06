import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Membership from './components/Membership';
import BmiCalculator from './components/BmiCalculator';
import Trainers from './components/Trainers';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Logo from './components/Logo';

function AppContent() {
  const [isAdminView, setIsAdminView] = useState(false);
  const { theme, isChangingTheme, isLoading } = useTheme();

  const toggleAdminView = () => {
    setIsAdminView((prev) => !prev);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[9999] select-none">
        {/* Pulsing crown & glowing loading circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Logo with double animation */}
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              rotateY: [0, 180, 360]
            }}
            transition={{ 
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 3, repeat: Infinity, ease: "linear" }
            }}
            className="w-16 h-16 bg-red-600/10 border border-red-600/30 rounded-2xl flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(225,29,72,0.15)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-9 h-9"
            >
              <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
              <path d="M3 20h18a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1z" />
            </svg>
          </motion.div>

          <div className="text-center space-y-2 mt-4">
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-widest text-white uppercase leading-none">
              ROYAL <span className="text-red-500">FITNESS</span>
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">
              CLUB SARANGPUR
            </p>
          </div>

          {/* Glowing linear indicator */}
          <div className="w-48 h-1 bg-gray-900 rounded-full overflow-hidden mt-6 border border-white/5 shadow-inner">
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="relative w-1/2 h-full bg-red-600 rounded-full shadow-[0_0_8px_#e11d48]"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-dark-bg text-gray-100 flex flex-col justify-between selection:bg-red-600 selection:text-white overflow-x-hidden">
      {/* Theme changing transition flash effect */}
      <AnimatePresence>
        {isChangingTheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-red-600 z-[9999] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Dynamic Header */}
      <Navbar onAdminToggle={toggleAdminView} isAdminView={isAdminView} />

      {/* Main View Area */}
      <main className="flex-grow">
        {isAdminView ? (
          <AdminDashboard />
        ) : (
          <>
            <Hero />
            <About />
            <Services />
            <Membership />
            <BmiCalculator />
            <Trainers />
            <Gallery />
            <Testimonials />
            <Faq />
            <Contact />
            <FloatingWhatsApp />
          </>
        )}
      </main>

      {/* Premium Footer */}
      <footer className="bg-dark-bg border-t border-dark-card-border/80 py-12 md:py-16 relative overflow-hidden">
        {/* Accent Spot */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-12">
            
            {/* Column 1: Brand details */}
            <div className="md:col-span-5 space-y-4">
              <Logo />
              <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
                Royal Fitness Club is Sarangpur’s premier bodybuilding and functional training arena. Our mission is to empower individuals to conquer physical limitations and conquer the royal lifestyle.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-red-500 font-bold bg-red-600/10 border border-red-600/20 px-2 py-1 rounded-md">
                  Est. 2024
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-bold bg-gray-900 border border-dark-card-border px-2 py-1 rounded-md">
                  ISO 9001:2015 Certified
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-white font-display font-semibold text-xs uppercase tracking-widest">
                Explore Club
              </h4>
              <ul className="space-y-2 text-xs text-gray-400 font-sans">
                <li><a href="#about" className="hover:text-red-500 transition-colors">About Story</a></li>
                <li><a href="#services" className="hover:text-red-500 transition-colors">Elite Programs</a></li>
                <li><a href="#membership" className="hover:text-red-500 transition-colors">Pricing Packages</a></li>
                <li><a href="#trainers" className="hover:text-red-500 transition-colors">Coaching Staff</a></li>
                <li><a href="#gallery" className="hover:text-red-500 transition-colors">In-house Gallery</a></li>
              </ul>
            </div>

            {/* Column 3: Contact details quick reference */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-white font-display font-semibold text-xs uppercase tracking-widest">
                Support Enquiries
              </h4>
              <ul className="space-y-3.5 text-xs text-gray-400 font-sans">
                <li className="flex items-start gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span>Shagun Vihar colony, Sarangpur, Madhya Pradesh 465697</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-500 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.18-4.156-6.98-6.98l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <a href="tel:07999960952" className="hover:text-red-500 transition-colors">07999960952</a>
                </li>
              </ul>
            </div>

          </div>

          <div className="w-full h-px bg-dark-card-border/60 my-8"></div>

          {/* Bottom Copyright details */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 font-mono">
            <div>
              © {new Date().getFullYear()} Royal Fitness Club. All Rights Reserved.
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAdminView}
                className="hover:text-red-500 transition-colors uppercase tracking-widest font-bold cursor-pointer"
              >
                {isAdminView ? 'Return to Gym Website' : 'Owner Portal Terminal'}
              </button>
              <span>•</span>
              <span className="uppercase tracking-widest text-[9px] text-red-600 font-bold animate-pulse">
                Made for Sarangpur
              </span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
