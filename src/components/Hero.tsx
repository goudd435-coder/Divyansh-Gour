import React from 'react';
import { motion } from 'motion/react';
import ImageWithSkeleton from './ImageWithSkeleton';

export default function Hero() {
  const stats = [
    { value: '1,200+', label: 'Active Members' },
    { value: '8+', label: 'Certified Coaches' },
    { value: '50+', label: 'Modern Machines' },
    { value: '4,000+', label: 'Sq. Ft. Floor Area' },
  ];

  const handleScrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 bg-dark-bg overflow-hidden"
    >
      {/* Background Graphic Overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_30%,rgba(229,9,20,0.12),transparent_45%)] pointer-events-none"></div>

      {/* Hero Image Underlay with dark gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent lg:to-[#050505]/40 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
        <ImageWithSkeleton
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1800&auto=format&fit=crop"
          alt="Royal Fitness Club Interior"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-125"
          wrapperClassName="w-full h-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 flex-grow flex items-center">
        <div className="max-w-3xl py-12 md:py-20 lg:py-28">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 font-mono text-xs uppercase tracking-wider mb-6 animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Sarangpur's Premier Fitness Destination
          </div>

          {/* Slogan */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none mb-6">
            CONQUER FROM <br className="hidden sm:inline" />
            WITHIN. RULE THE <br className="hidden sm:inline" />
            <span className="text-red-500 relative inline-block">
              ROYAL WAY.
              <span className="absolute left-0 bottom-1 w-full h-1.5 bg-red-600/50 rounded-full"></span>
            </span>
          </h1>

          {/* Slogan description */}
          <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-xl mb-10 font-sans font-light leading-relaxed">
            Stop wishing, start working. Get premium general trainer support, advanced bodybuilding machinery, and custom diet charts under the professional guidance of founder <strong className="text-white font-semibold">Shyam Rajput</strong>.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScrollTo('#membership')}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-sm rounded-xl transition-all duration-300 shadow-lg shadow-red-600/25 hover:shadow-red-600/40 cursor-pointer"
              id="hero-join-btn"
            >
              Get Started Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScrollTo('#contact')}
              className="px-8 py-4 bg-transparent hover:bg-gray-950/40 text-white font-bold uppercase tracking-wider text-sm rounded-xl border-2 border-gray-800 hover:border-red-600/50 transition-all duration-300 cursor-pointer"
              id="hero-contact-btn"
            >
              Contact Club
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Board (Desktop and Mobile Horizontal row) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-dark-card/85 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-2xl shadow-2xl">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center flex flex-col justify-center ${i < 3 ? 'border-r-0 md:border-r border-dark-card-border/60' : ''}`}
            >
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <span className="text-red-500">{stat.value.replace('+', '')}</span>+
              </div>
              <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest font-medium mt-1 font-sans">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
