import React, { useState } from 'react';
import { TESTIMONIALS } from '../data';
import ImageWithSkeleton from './ImageWithSkeleton';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeIndex];

  return (
    <section id="testimonials" className="py-24 bg-dark-bg border-t border-red-950/20 relative overflow-hidden">
      {/* Background Graphic elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/5 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase mb-3">
            Client Success
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Hear From Our <span className="text-red-500">Royal Achievers</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Read real feedback from local Sarangpur residents who restructured their bodies, stamina levels, and healthy habits with us.
          </p>
        </div>

        {/* Carousel Slider */}
        <div className="relative bg-dark-card border border-dark-card-border p-6 sm:p-12 rounded-3xl shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
          
          {/* Quote icon watermark */}
          <div className="absolute -top-6 -left-6 w-32 h-32 text-red-600/5 pointer-events-none select-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-6 sm:space-y-8">
            {/* Stars Row */}
            <div className="flex items-center gap-1">
              {[...Array(current.rating)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-yellow-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="text-gray-200 text-base sm:text-lg md:text-xl italic font-sans font-light leading-relaxed">
              "{current.feedback}"
            </p>

            {/* If Transformation info exists, show before/after callout */}
            {current.transformation && (
              <div className="p-4 bg-dark-bg/60 border border-dark-card-border rounded-xl flex flex-col sm:flex-row gap-4 justify-around text-xs font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-600"></span>
                  <span>{current.transformation.before}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-white font-semibold">{current.transformation.after}</span>
                </div>
              </div>
            )}
          </div>

          {/* User Bio and Navigation arrows */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-dark-card-border/60">
            {/* Bio */}
            <div className="flex items-center gap-4">
              <ImageWithSkeleton
                src={current.imageUrl}
                alt={current.name}
                className="w-14 h-14 rounded-full object-cover border border-red-500/30"
                wrapperClassName="w-14 h-14 rounded-full"
              />
              <div>
                <h4 className="font-display font-bold text-base text-white tracking-wide">{current.name}</h4>
                <p className="text-gray-400 text-xs font-mono">{current.role}</p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors border border-white/5 shadow-md active:scale-95"
                title="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              
              {/* Pagination counter */}
              <span className="text-xs font-mono font-bold text-gray-400">
                <span className="text-red-500">{activeIndex + 1}</span> / {TESTIMONIALS.length}
              </span>

              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors border border-white/5 shadow-md active:scale-95"
                title="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
