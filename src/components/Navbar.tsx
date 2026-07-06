import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-dark-card-border/80 bg-dark-card/50 text-gray-400 hover:text-white cursor-pointer transition-all duration-300 flex items-center justify-center shadow-md shadow-black/5"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      id="theme-toggle-btn"
    >
      {theme === 'light' ? (
        <Sun className="w-4.5 h-4.5 text-blue-500 animate-[spin_12s_linear_infinite]" />
      ) : (
        <Moon className="w-4.5 h-4.5 text-red-500" />
      )}
    </motion.button>
  );
};

interface NavbarProps {
  onAdminToggle: () => void;
  isAdminView: boolean;
}

export default function Navbar({ onAdminToggle, isAdminView }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Memberships', href: '#membership' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (isAdminView) {
      // Return to gym view first
      onAdminToggle();
      // Delay slightly to let the view transition before scrolling
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-bg/95 backdrop-blur-md shadow-lg border-b border-white/5 py-3' : 'bg-transparent py-5'}`}
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="focus:outline-none">
            <Logo />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-sans font-medium text-sm text-gray-300 hover:text-red-500 transition-colors uppercase tracking-wider"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />

            {/* Admin Dashboard Entry */}
            <button
              onClick={onAdminToggle}
              id="admin-dashboard-toggle-btn"
              className={`p-2 rounded-lg border transition-all duration-300 flex items-center gap-1 text-xs uppercase tracking-wider font-semibold ${isAdminView ? 'bg-red-600 text-white border-red-600' : 'bg-transparent text-gray-400 hover:text-white border-gray-800 hover:border-gray-700'}`}
              title={isAdminView ? 'Return to Gym Website' : 'Admin Panel Access'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                {isAdminView ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                )}
              </svg>
              {isAdminView ? 'Gym Site' : 'Owner Portal'}
            </button>

            {/* General CTA */}
            {!isAdminView && (
              <a
                href="#membership"
                onClick={(e) => handleLinkClick(e, '#membership')}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm uppercase tracking-wider font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20 active:scale-95"
              >
                Join Now
              </a>
            )}
          </div>

          {/* Hamburger Mobile Icon */}
          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />

            {/* Quick Admin Icon for Mobile */}
            <button
              onClick={onAdminToggle}
              className={`p-2 rounded-lg border sm:hidden transition-all duration-300 ${isAdminView ? 'bg-red-600 text-white border-red-600' : 'bg-transparent text-gray-400 border-gray-800'}`}
              title="Admin Panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white focus:outline-none"
              id="mobile-menu-hamburger-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-dark-bg/95 backdrop-blur-md border-b border-white/5 ${isMobileMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="px-4 space-y-3 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="block font-sans font-medium text-base text-gray-300 hover:text-red-500 transition-colors uppercase tracking-wider py-2 border-b border-white/5"
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onAdminToggle();
              }}
              className="w-full py-2.5 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white rounded-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              {isAdminView ? 'View Gym Site' : 'Owner Portal'}
            </button>
            {!isAdminView && (
              <a
                href="#membership"
                onClick={(e) => handleLinkClick(e, '#membership')}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-center font-bold uppercase tracking-wider rounded-lg block"
              >
                Join Now
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
