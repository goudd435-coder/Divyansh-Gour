import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function BmiCalculator() {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [advice, setAdvice] = useState<string>('');

  const calculateBmi = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to meters

    if (w > 0 && h > 0) {
      const calculatedBmi = w / (h * h);
      const roundedBmi = Math.round(calculatedBmi * 10) / 10;
      setBmi(roundedBmi);

      // Determine category and advice
      if (roundedBmi < 18.5) {
        setCategory('Underweight');
        setAdvice('Recommended Program: "Muscle Gain" with Shyam Rajput. Focus on our custom hypertrophy and mass-building meal plan to gain lean bulk.');
      } else if (roundedBmi >= 18.5 && roundedBmi < 24.9) {
        setCategory('Healthy Weight');
        setAdvice('Recommended Program: "Strength & Conditioning" or "CrossFit". Excellent job! Maintain your athletic posture, endurance, and VO2 levels.');
      } else if (roundedBmi >= 25 && roundedBmi < 29.9) {
        setCategory('Overweight');
        setAdvice('Recommended Program: "Weight Loss & HIIT". Focus on a calorie deficit meal plan and metabolic circuit programs to shed excess body fat.');
      } else {
        setCategory('Obese');
        setAdvice('Recommended Program: "Metabolic Coaching & Cardio Clinics". Let us work 1-on-1 with cardio interval routine setups to rebuild energy levels.');
      }
    }
  };

  const resetCalculator = () => {
    setWeight('');
    setHeight('');
    setBmi(null);
    setCategory('');
    setAdvice('');
  };

  // Get color for BMI needle
  const getCategoryColor = () => {
    if (!bmi) return 'bg-gray-500';
    if (bmi < 18.5) return 'bg-yellow-500';
    if (bmi >= 18.5 && bmi < 24.9) return 'bg-green-500';
    if (bmi >= 25 && bmi < 29.9) return 'bg-orange-500';
    return 'bg-red-600';
  };

  return (
    <section id="bmi-calculator" className="py-20 bg-dark-bg border-t border-red-950/20 relative overflow-hidden">
      {/* Background Red Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase mb-3">
            Health Check
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Calculate Your <span className="text-red-500">BMI Index</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Quickly check your Body Mass Index (BMI) to understand your body composition and align your training program accordingly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 bg-dark-card border border-dark-card-border p-6 md:p-10 rounded-2xl shadow-xl">
          {/* Inputs Form */}
          <div>
            <form onSubmit={calculateBmi} className="space-y-6">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  required
                  placeholder="e.g. 70"
                  min="30"
                  max="250"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  required
                  placeholder="e.g. 175"
                  min="100"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  id="bmi-calculate-btn"
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Calculate Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  id="bmi-reset-btn"
                  onClick={resetCalculator}
                  className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Reset
                </motion.button>
              </div>
            </form>
          </div>

          {/* Output Display */}
          <div className="flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-dark-card-border pt-6 md:pt-0 md:pl-8">
            {bmi === null ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">No Results Yet</h3>
                <p className="text-gray-400 text-xs mt-1">Enter weight and height to get results</p>
              </div>
            ) : (
              <div className="w-full text-center space-y-6">
                <div>
                  <div className="text-gray-400 font-mono text-xs uppercase tracking-wider">Your Body Mass Index</div>
                  <div className="text-5xl font-extrabold text-white mt-1 font-mono tracking-tight">
                    {bmi} <span className="text-xs text-red-500 uppercase">kg/m²</span>
                  </div>
                </div>

                <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white uppercase tracking-wider" style={{ backgroundColor: 'rgba(225, 29, 72, 0.15)', border: '1px solid #e11d48' }}>
                  Category: <span className="text-red-500 font-bold">{category}</span>
                </div>

                {/* Progress bar scale */}
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>18.5 (Under)</span>
                    <span>25 (Normal)</span>
                    <span>30 (Over)</span>
                  </div>
                  <div className="relative w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                    {/* Visual markers */}
                    <div className="absolute left-[18.5%] top-0 bottom-0 w-0.5 bg-gray-700"></div>
                    <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-gray-700"></div>
                    <div className="absolute left-[75%] top-0 bottom-0 w-0.5 bg-gray-700"></div>

                    {/* Progress Fill */}
                    <div
                      className={`h-full transition-all duration-1000 rounded-full ${getCategoryColor()}`}
                      style={{ width: `${Math.min(100, Math.max(10, (bmi / 40) * 100))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Advice Box */}
                <div className="p-4 bg-dark-bg/80 border border-dark-card-border rounded-xl text-left">
                  <div className="text-red-500 font-semibold text-xs uppercase tracking-wider font-mono mb-1">
                    Royal Advisory
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">{advice}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
