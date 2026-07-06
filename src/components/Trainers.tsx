import React from 'react';
import { TRAINERS } from '../data';
import ImageWithSkeleton from './ImageWithSkeleton';

export default function Trainers() {
  return (
    <section id="trainers" className="py-24 bg-dark-bg border-t border-red-950/20 relative overflow-hidden">
      {/* Decorative background light */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase mb-3">
            Expert Mentors
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Meet Our Certified <span className="text-red-500">Trainers</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Our certified coaching staff holds gold-standard accreditations. Get professional biomechanical feedback, safety spotting, and dedicated motivation.
          </p>
        </div>

        {/* Trainers Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRAINERS.map((trainer) => (
            <div
              key={trainer.id}
              className="group bg-dark-card border border-dark-card-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-red-600/40 hover:-translate-y-1 hover:shadow-xl"
              id={`trainer-card-${trainer.id}`}
            >
              {/* Photo */}
              <div className="relative h-80 overflow-hidden">
                <ImageWithSkeleton
                  src={trainer.imageUrl}
                  alt={trainer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  wrapperClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/30 to-transparent"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-red-600 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-yellow-300">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                  {trainer.rating}
                </div>

                {/* Experience counter inside image bottom */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-red-500 bg-red-600/10 border border-red-600/30 px-2 py-1 rounded-md">
                    {trainer.experience} Experience
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-white tracking-wide">
                    {trainer.name}
                  </h3>
                  <p className="text-red-500 text-xs font-semibold tracking-wider uppercase font-mono mt-0.5">
                    {trainer.role}
                  </p>
                </div>

                <div className="w-full h-px bg-dark-card-border"></div>

                {/* Specializations list */}
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-semibold">Specialties</span>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.specialization.map((spec) => (
                      <span
                        key={spec}
                        className="text-[10px] bg-gray-900 border border-gray-800 text-gray-300 font-medium px-2 py-0.5 rounded-md"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
