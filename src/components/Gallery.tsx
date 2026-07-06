import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data';
import ImageWithSkeleton from './ImageWithSkeleton';

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<'all' | 'equipment' | 'workout' | 'interior' | 'transformation'>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  const filterTabs = [
    { key: 'all', label: 'All Photos' },
    { key: 'equipment', label: 'Equipment' },
    { key: 'workout', label: 'Workout Zones' },
    { key: 'interior', label: 'Club Interiors' },
    { key: 'transformation', label: 'Transformations' },
  ];

  const filteredItems = activeTab === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  const openLightbox = (url: string, title: string) => {
    setLightboxImage(url);
    setLightboxTitle(title);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <section id="gallery" className="py-24 bg-dark-card border-t border-red-950/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase mb-3">
            In-House Gallery
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Look Inside Our <span className="text-red-500">Facility</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Experience our clean, temperature-controlled bodybuilding environment. See actual photos of our advanced machines, yoga mats, and transformations.
          </p>
        </div>

        {/* Categories Tabs Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 sm:px-6 py-2.5 font-sans font-semibold text-xs uppercase tracking-wider rounded-lg transition-all duration-300 ${activeTab === tab.key ? 'bg-red-600 text-white shadow-lg shadow-red-600/15' : 'bg-dark-bg/50 border border-dark-card-border hover:border-gray-700 text-gray-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item.imageUrl, item.title)}
              className="group relative h-72 rounded-2xl overflow-hidden border border-white/5 shadow-lg cursor-zoom-in bg-dark-bg transition-transform duration-300 hover:scale-[1.01]"
              id={`gallery-item-${item.id}`}
            >
              {/* Photo */}
              <ImageWithSkeleton
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                wrapperClassName="w-full h-full"
              />

              {/* Gradient cover */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Text overlays */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-red-500 font-bold bg-red-600/10 border border-red-600/20 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <h4 className="text-white font-display font-bold text-base mt-2 tracking-wide">
                    {item.title}
                  </h4>
                </div>
                
                {/* Zoom Icon indicator */}
                <div className="w-8 h-8 rounded-full bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604ZM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-fade-in cursor-zoom-out"
          id="gallery-lightbox-modal"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-gray-900/80 hover:bg-red-600 text-white border border-white/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Picture */}
          <div className="max-w-4xl max-h-[80vh] relative select-none">
            <img
              src={lightboxImage}
              alt={lightboxTitle}
              className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/10 shadow-2xl"
            />
            {/* Title display */}
            <div className="text-center mt-4">
              <h4 className="text-white font-display font-semibold text-lg md:text-xl">{lightboxTitle}</h4>
              <p className="text-gray-400 text-xs mt-1 uppercase font-mono tracking-widest">Royal Fitness Club • Sarangpur</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
