import React, { useState } from 'react';
import { FAQS } from '../data';

export default function Faq() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-dark-bg border-t border-red-950/20 relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase mb-3">
            Got Questions?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-red-500">Questions</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Everything you need to know about Royal Fitness Club memberships, rules, operating batches, and training packages.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-dark-card border border-dark-card-border rounded-xl overflow-hidden transition-all duration-300 hover:border-red-600/30"
                id={`faq-item-${faq.id}`}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left text-white focus:outline-none focus:ring-1 focus:ring-red-600/20"
                >
                  <span className="font-display font-semibold text-base md:text-lg pr-4 hover:text-red-400 transition-colors">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-red-600 text-white rotate-180' : 'bg-gray-800 text-gray-400'}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {/* Animated Collapse panel */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-60 border-t border-dark-card-border bg-dark-bg/20' : 'max-h-0'}`}
                >
                  <p className="p-5 text-gray-300 text-sm leading-relaxed font-sans">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
