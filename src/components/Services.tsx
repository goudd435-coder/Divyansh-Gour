import React from 'react';
import { SERVICES } from '../data';

export default function Services() {
  return (
    <section id="services" className="py-24 bg-dark-bg border-t border-red-950/20 relative overflow-hidden">
      {/* Decorative Blur circles */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase mb-3">
            What We Offer
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Elite Fitness <span className="text-red-500">Services</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Whether your goal is to sculpt lean bulk, increase cardiorespiratory VO2 levels, or master flexibility, we have a specialized program for you.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group bg-dark-card border border-dark-card-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-red-600/50 hover:shadow-xl hover:shadow-red-600/5 hover:-translate-y-1 flex flex-col"
              id={`service-card-${service.id}`}
            >
              {/* Image box */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent"></div>
                
                {/* Title badge inside image */}
                <span className="absolute bottom-4 left-4 font-display font-bold text-xl text-white tracking-wide uppercase">
                  {service.title}
                </span>
              </div>

              {/* Content box */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <p className="text-gray-400 text-xs leading-relaxed font-sans">
                  {service.description}
                </p>

                {/* Checklist */}
                <ul className="space-y-2.5">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-gray-300 font-sans">
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-2.5 h-2.5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.208Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
