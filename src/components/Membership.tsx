import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MEMBERSHIP_PLANS } from '../data';
import { supabase } from '../lib/supabase';

export default function Membership() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Quarterly',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlanSelect = (planName: string) => {
    setFormData((prev) => ({ ...prev, plan: planName }));
    // Smooth scroll to the form
    const formElement = document.querySelector('#registration-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const submissionId = 'enq_' + Math.random().toString(36).substr(2, 9);
    const submissionData = {
      id: submissionId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      plan: formData.plan,
      message: formData.message || '',
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    console.log('[Membership Submission] Starting submit flow with details:', submissionData);

    try {
      let isSubmitted = false;

      // Path 1: Direct Supabase Insertion (Priority - Serverless / Local-Free)
      if (supabase) {
        console.log('[Membership Submission] Attempting direct Supabase insert into primary table: gym_memberships');
        try {
          const { error: gymError } = await supabase
            .from('gym_memberships')
            .insert([submissionData]);

          if (!gymError) {
            console.log('[Membership Submission] Direct Supabase insert into gym_memberships table succeeded!');
            isSubmitted = true;
          } else {
            console.warn('[Membership Submission] Direct insert into gym_memberships failed:', gymError.message);
            console.log('[Membership Submission] Retrying with backup table: enquiries...');
            
            const { error: enqError } = await supabase
              .from('enquiries')
              .insert([submissionData]);

            if (!enqError) {
              console.log('[Membership Submission] Direct Supabase insert into enquiries table succeeded!');
              isSubmitted = true;
            } else {
              console.warn('[Membership Submission] Direct insert into backup enquiries table failed:', enqError.message);
            }
          }
        } catch (sbErr: any) {
          console.error('[Membership Submission] Direct Supabase insert attempt threw an exception:', sbErr);
        }
      }

      // Path 2: Fallback to backend API if Supabase is unavailable or failed
      if (!isSubmitted) {
        console.log('[Membership Submission] Direct Supabase inserts unavailable or failed. Attempting API route POST to /api/enquiries...');
        const response = await fetch('/api/enquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[Membership Submission] API route submission success!', data);
          isSubmitted = true;
        } else {
          let apiErrorMsg = 'Failed to submit via API.';
          try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errData = await response.json();
              apiErrorMsg = errData.error || apiErrorMsg;
            } else {
              const textErr = await response.text();
              console.error('[Membership Submission] API HTML/Non-JSON error response received:', textErr);
              apiErrorMsg = `Server error (${response.status}): ${textErr.substring(0, 100)}...`;
            }
          } catch (parseErr) {
            console.error('[Membership Submission] Error parsing API error:', parseErr);
          }
          throw new Error(apiErrorMsg);
        }
      }

      if (isSubmitted) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          plan: 'Quarterly',
          message: ''
        });
      } else {
        throw new Error('Database submission failed. Please verify your Supabase tables are set up.');
      }

    } catch (err: any) {
      console.error('[Membership Submission] Submission error occurred:', err);
      setError(err.message || 'An unexpected connection error occurred. Please verify your Supabase tables are set up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="membership" className="py-24 bg-dark-card border-t border-red-950/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase mb-3">
            Choose Your Tier
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Membership <span className="text-red-500">Pricing Packages</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Invest in your health. Choose a tier that matches your training schedule. No registration fees, hidden charges or dynamic price additions.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-dark-bg border rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${plan.popular ? 'border-red-600 shadow-2xl shadow-red-600/10 ring-1 ring-red-600' : 'border-dark-card-border'}`}
              id={`pricing-card-${plan.name.toLowerCase()}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white font-mono text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </span>
              )}

              <div>
                {/* Plan Name */}
                <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider mb-2">
                  {plan.name} Pack
                </h3>
                
                {/* Price block */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">{plan.price}</span>
                  <span className="text-xs text-gray-500 line-through font-mono">{plan.originalPrice}</span>
                  {plan.savings && (
                    <span className="text-[10px] bg-red-600/10 text-red-500 border border-red-600/20 px-2 py-0.5 rounded-md font-mono font-bold uppercase ml-2">
                      {plan.savings}
                    </span>
                  )}
                </div>

                <div className="w-full h-px bg-dark-card-border mb-6"></div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Select Plan Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlanSelect(plan.name)}
                className={`w-full py-3.5 font-bold uppercase tracking-wider text-xs rounded-xl transition-all duration-300 cursor-pointer ${plan.popular ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20' : 'bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 hover:border-gray-700'}`}
              >
                Select {plan.name} Pack
              </motion.button>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div id="registration-form" className="max-w-2xl mx-auto bg-dark-bg border border-dark-card-border p-6 sm:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Accent red spot */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl"></div>
          
          <div className="text-center mb-8 relative z-10">
            <h3 className="font-display font-bold text-2xl text-white mb-2 uppercase tracking-wide">
              Online Member <span className="text-red-500 font-black">Registration</span>
            </h3>
            <p className="text-gray-400 text-xs">
              Fill out this enquiry form. Shyam Sir or one of our general executives will contact you within 4 hours to activate your membership trial.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Status Messages */}
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
                <div>
                  <h4 className="font-bold text-sm">Submission Successful!</h4>
                  <p className="text-xs text-green-500/80 mt-0.5">Your enquiry has been registered in the database. Shyam Sir will call you shortly on your provided phone number.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl flex items-start gap-3 text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <div>
                  <h4 className="font-bold text-sm">Submission Failed</h4>
                  <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="e.g. 07999960952"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="e.g. rahul@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label htmlFor="plan" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Select Package Tier
                </label>
                <select
                  id="plan"
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
                >
                  <option value="Monthly">Monthly Pack (₹1,499)</option>
                  <option value="Quarterly">Quarterly Pack (₹3,499)</option>
                  <option value="Yearly">Yearly Pack (₹9,999)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Special Requests or Medical History (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Write any request (e.g. custom timings, injury recovery, muscle focus...)"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark-card border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm resize-none"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              id="registration-submit-btn"
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-sm rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Registration...
                </>
              ) : (
                'Submit Royal Enrolment'
              )}
            </motion.button>
          </form>
        </div>

      </div>
    </section>
  );
}
