import React from 'react';
import ImageWithSkeleton from './ImageWithSkeleton';

export default function About() {
  const values = [
    {
      title: 'Our Mission',
      description: 'To foster a culture of strength, discipline, and health in Sarangpur by delivering state-of-the-art strength training and nutritional coaching with unparalleled general guidance.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
        </svg>
      )
    },
    {
      title: 'Our Vision',
      description: 'To be recognized as the gold standard of premium gyms in Madhya Pradesh, continuously empowering our community to conquer obstacles and unlock their full athletic capabilities.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )
    }
  ];

  return (
    <section id="about" className="py-24 bg-dark-card border-t border-red-950/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Story & Vision */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase mb-3">
                Our Legacy
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                Welcome to <br />
                <span className="text-red-500">Royal Fitness Club</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Founded by certified veteran trainer <strong className="text-white font-semibold">Shyam Rajput</strong>, Royal Fitness Club represents the pinnacle of physical wellness in Sarangpur, Madhya Pradesh. Our premium multi-story facility features heavy strength-training equipment, top-tier cardio runners, and a serene, dedicated wood-floor studio with colorful yoga/Zumba artwork.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-4 leading-relaxed">
                We don't just lease locker space or treadmill hours; we provide a structured path to dynamic muscle gain, sustainable weight loss, and athletic functional stamina. With real certified coaches, custom monthly diet plans, and daily motivation, you will exceed your fitness goals.
              </p>
            </div>

            {/* Mission & Vision Rows */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {values.map((v) => (
                <div key={v.title} className="p-5 bg-dark-bg/60 border border-dark-card-border/60 rounded-xl space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center">
                    {v.icon}
                  </div>
                  <h3 className="text-white font-display font-semibold text-lg">{v.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Photo collage & Certified Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              {/* Image representative of modern wood-floor studio & dumbbells */}
              <ImageWithSkeleton
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop"
                alt="Gym Weight Lifting Area"
                className="w-full h-[380px] object-cover scale-100 hover:scale-105 transition-transform duration-500 filter brightness-90"
                wrapperClassName="w-full h-[380px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              
              {/* Overlay Cert Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-red-600/90 backdrop-blur-md p-5 rounded-xl flex items-center gap-4 border border-white/15">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide uppercase">Gold-Standard Gym</h4>
                  <p className="text-red-100 text-xs">Fully certified trainers, hygienic environment, state-of-the-art security cams.</p>
                </div>
              </div>
            </div>

            {/* Behind floating graphic dot */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-600/10 rounded-full blur-2xl z-0"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
